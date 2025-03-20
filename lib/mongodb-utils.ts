import { MongoClient, ObjectId } from "mongodb"
import type { User, Job, Application, CandidateProfile, Company, ContactSubmission } from "./models"

// Connection URI
const uri = process.env.MONGODB_URI || "mongodb+srv://aihire:NBJ4Dnm2l7LMNTUJ@hireapi.t0wq3.mongodb.net/"
const dbName = process.env.MONGODB_DB_NAME || "aihireAPI"

// Create a singleton instance of MongoClient
let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

// Helper function to get the database
export async function getDb() {
  const client = await clientPromise
  return client.db(dbName)
}

// Convert string ID to ObjectId
export function toObjectId(id: string) {
  return new ObjectId(id)
}

// Convert ObjectId to string
export function fromObjectId(id: ObjectId) {
  return id.toString()
}

// User operations
export async function createUser(userData: Omit<User, "_id" | "createdAt">) {
  const db = await getDb()
  const collection = db.collection("users")

  // Check if user with this email already exists
  const existingUser = await collection.findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  const newUser = {
    ...userData,
    createdAt: new Date(),
  }

  const result = await collection.insertOne(newUser)
  return { ...newUser, _id: result.insertedId.toString() }
}

export async function getUserByEmail(email: string) {
  const db = await getDb()
  const user = await db.collection("users").findOne({ email })
  return user
}

export async function getUserById(id: string) {
  const db = await getDb()
  const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
  return user
}

// Job operations
export async function createJob(jobData: Omit<Job, "_id" | "createdAt">) {
  const db = await getDb()
  const collection = db.collection("jobs")

  const newJob = {
    ...jobData,
    createdAt: new Date(),
    applicants: 0,
  }

  const result = await collection.insertOne(newJob)
  return { ...newJob, _id: result.insertedId.toString() }
}

export async function getJobs(filter = {}) {
  const db = await getDb()
  const jobs = await db.collection("jobs").find(filter).sort({ createdAt: -1 }).toArray()

  return jobs.map((job) => ({
    ...job,
    _id: job._id.toString(),
  }))
}

export async function getJobsByRecruiter(recruiterId: string) {
  return getJobs({ postedBy: recruiterId })
}

export async function getJobById(id: string) {
  const db = await getDb()
  const job = await db.collection("jobs").findOne({ _id: new ObjectId(id) })

  if (!job) return null

  return {
    ...job,
    _id: job._id.toString(),
  }
}

export async function updateJob(id: string, jobData: Partial<Job>) {
  const db = await getDb()
  const collection = db.collection("jobs")

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...jobData,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  if (!result) {
    throw new Error("Job not found")
  }

  return {
    ...result,
    _id: result._id.toString(),
  }
}

export async function deleteJob(id: string) {
  const db = await getDb()
  await db.collection("jobs").deleteOne({ _id: new ObjectId(id) })
  return { id }
}

// Application operations
export async function createApplication(applicationData: Omit<Application, "_id" | "appliedDate">) {
  const db = await getDb()

  // Check if user has already applied to this job
  const existingApplication = await db.collection("applications").findOne({
    jobId: applicationData.jobId,
    userId: applicationData.userId,
  })

  if (existingApplication) {
    throw new Error("You have already applied to this job")
  }

  const newApplication = {
    ...applicationData,
    status: "Pending",
    appliedDate: new Date(),
  }

  const result = await db.collection("applications").insertOne(newApplication)

  // Increment the applicants count for the job
  await db.collection("jobs").updateOne({ _id: new ObjectId(applicationData.jobId) }, { $inc: { applicants: 1 } })

  return { ...newApplication, _id: result.insertedId.toString() }
}

export async function getApplicationsByUserId(userId: string) {
  const db = await getDb()
  const applications = await db.collection("applications").find({ userId }).sort({ appliedDate: -1 }).toArray()

  return applications.map((app) => ({
    ...app,
    _id: app._id.toString(),
  }))
}

export async function getApplicationsByJobId(jobId: string) {
  const db = await getDb()
  const applications = await db.collection("applications").find({ jobId }).sort({ appliedDate: -1 }).toArray()

  return applications.map((app) => ({
    ...app,
    _id: app._id.toString(),
  }))
}

export async function getApplicationById(id: string) {
  const db = await getDb()
  const application = await db.collection("applications").findOne({ _id: new ObjectId(id) })

  if (!application) return null

  return {
    ...application,
    _id: application._id.toString(),
  }
}

export async function updateApplicationStatus(id: string, status: Application["status"]) {
  const db = await getDb()

  const result = await db.collection("applications").findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  )

  if (!result) {
    throw new Error("Application not found")
  }

  return {
    ...result,
    _id: result._id.toString(),
  }
}

// Candidate Profile operations
export async function createOrUpdateProfile(profileData: Partial<CandidateProfile> & { userId: string }) {
  const db = await getDb()
  const collection = db.collection("candidateProfiles")

  // Check if profile already exists
  const existingProfile = await collection.findOne({ userId: profileData.userId })

  if (existingProfile) {
    // Update existing profile
    const result = await collection.findOneAndUpdate(
      { userId: profileData.userId },
      {
        $set: {
          ...profileData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    return {
      ...result,
      _id: result._id.toString(),
    }
  } else {
    // Create new profile
    const newProfile = {
      ...profileData,
      skills: profileData.skills || [],
      createdAt: new Date(),
    }

    const result = await collection.insertOne(newProfile)
    return { ...newProfile, _id: result.insertedId.toString() }
  }
}

export async function getProfileByUserId(userId: string) {
  const db = await getDb()
  const profile = await db.collection("candidateProfiles").findOne({ userId })

  if (!profile) return null

  return {
    ...profile,
    _id: profile._id.toString(),
  }
}

// Company operations
export async function createCompany(companyData: Omit<Company, "_id" | "createdAt">) {
  const db = await getDb()

  const newCompany = {
    ...companyData,
    createdAt: new Date(),
  }

  const result = await db.collection("companies").insertOne(newCompany)
  return { ...newCompany, _id: result.insertedId.toString() }
}

export async function getCompanies() {
  const db = await getDb()
  const companies = await db.collection("companies").find({}).sort({ name: 1 }).toArray()

  return companies.map((company) => ({
    ...company,
    _id: company._id.toString(),
  }))
}

export async function getCompanyById(id: string) {
  const db = await getDb()
  const company = await db.collection("companies").findOne({ _id: new ObjectId(id) })

  if (!company) return null

  return {
    ...company,
    _id: company._id.toString(),
  }
}

// Contact form submissions
export async function createContactSubmission(submissionData: Omit<ContactSubmission, "_id" | "createdAt">) {
  const db = await getDb()

  const newSubmission = {
    ...submissionData,
    createdAt: new Date(),
  }

  const result = await db.collection("contactSubmissions").insertOne(newSubmission)
  return { ...newSubmission, _id: result.insertedId.toString() }
}

export default clientPromise

