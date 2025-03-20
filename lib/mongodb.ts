import { MongoClient, ServerApiVersion, ObjectId } from "mongodb"

// Connection URI - use environment variables in production
const uri = process.env.MONGODB_URI || "mongodb+srv://aihire:NBJ4Dnm2l7LMNTUJ@hireapi.t0wq3.mongodb.net/"
const dbName = process.env.MONGODB_DB_NAME || "aihireAPI"

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

// Test the connection
async function testConnection() {
  try {
    await client.connect()
    console.log("Connected successfully to MongoDB")
    await client.db(dbName).command({ ping: 1 })
    console.log("MongoDB connection ping successful")
    return true
  } catch (error) {
    console.error("MongoDB connection error:", error)
    return false
  } finally {
    await client.close()
  }
}

// Run the test once at startup
testConnection().catch(console.error)

// Connection cache
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  clientPromise = client.connect()
}

// Helper function to get the database
export async function getDatabase() {
  const client = await clientPromise
  return client.db(dbName)
}

// Helper function to convert MongoDB ObjectId to string and vice versa
export function toObjectId(id: string) {
  return new ObjectId(id)
}

export function fromObjectId(id: ObjectId) {
  return id.toString()
}

// Helper functions for database operations

// Users collection
export async function getUsers() {
  const db = await getDatabase()
  return db.collection("users").find({}).toArray()
}

export async function getUserById(id: string) {
  const db = await getDatabase()
  return db.collection("users").findOne({ _id: new ObjectId(id) })
}

export async function getUserByEmail(email: string) {
  const db = await getDatabase()
  return db.collection("users").findOne({ email })
}

export async function createUser(userData: any) {
  const db = await getDatabase()
  const result = await db.collection("users").insertOne(userData)
  return { ...userData, _id: result.insertedId }
}

export async function updateUser(id: string, userData: any) {
  const db = await getDatabase()
  await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: userData })
  return { ...userData, _id: id }
}

// Jobs collection
export async function getJobs() {
  const db = await getDatabase()
  return db.collection("jobs").find({}).sort({ createdAt: -1 }).toArray()
}

export async function getJob(id: string) {
  const db = await getDatabase()
  return db.collection("jobs").findOne({ _id: new ObjectId(id) })
}

export async function createJob(jobData: any) {
  const db = await getDatabase()
  jobData.createdAt = new Date()
  const result = await db.collection("jobs").insertOne(jobData)
  return { ...jobData, _id: result.insertedId }
}

export async function updateJob(id: string, jobData: any) {
  const db = await getDatabase()
  jobData.updatedAt = new Date()
  await db.collection("jobs").updateOne({ _id: new ObjectId(id) }, { $set: jobData })
  return { ...jobData, _id: id }
}

export async function deleteJob(id: string) {
  const db = await getDatabase()
  await db.collection("jobs").deleteOne({ _id: new ObjectId(id) })
  return { id }
}

// Applications collection
export async function getApplications(userId?: string) {
  const db = await getDatabase()
  const query = userId ? { userId } : {}
  return db.collection("applications").find(query).sort({ createdAt: -1 }).toArray()
}

export async function getApplicationsByJobId(jobId: string) {
  const db = await getDatabase()
  return db.collection("applications").find({ jobId }).sort({ createdAt: -1 }).toArray()
}

export async function getApplication(id: string) {
  const db = await getDatabase()
  return db.collection("applications").findOne({ _id: new ObjectId(id) })
}

export async function createApplication(applicationData: any) {
  const db = await getDatabase()
  applicationData.createdAt = new Date()
  applicationData.status = applicationData.status || "Pending"
  const result = await db.collection("applications").insertOne(applicationData)
  return { ...applicationData, _id: result.insertedId }
}

export async function updateApplicationStatus(id: string, status: string) {
  const db = await getDatabase()
  await db.collection("applications").updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } })
  return { id, status }
}

// Helper function to check if user has already applied to a job
export async function hasUserAppliedToJob(userId: string, jobId: string) {
  const db = await getDatabase()
  const application = await db.collection("applications").findOne({ userId, jobId })
  return !!application
}

// Helper function to get job statistics
export async function getJobStats(recruiterId: string) {
  const db = await getDatabase()
  const jobs = await db.collection("jobs").find({ postedBy: recruiterId }).toArray()
  const jobIds = jobs.map((job) => job._id.toString())

  const applications = await db
    .collection("applications")
    .find({ jobId: { $in: jobIds } })
    .toArray()

  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((job) => job.status === "Active").length,
    totalApplications: applications.length,
    acceptedApplications: applications.filter((app) => app.status === "Accepted").length,
  }
}

export default clientPromise

