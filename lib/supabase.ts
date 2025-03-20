import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper functions for database operations
export async function getJobs() {
  try {
    const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return []
  }
}

export async function getJob(id: number) {
  try {
    const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching job:", error)
    return null
  }
}

export async function createJob(jobData: any) {
  try {
    const { data, error } = await supabase.from("jobs").insert([jobData]).select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error("Error creating job:", error)
    return null
  }
}

export async function updateJob(id: number, jobData: any) {
  try {
    const { data, error } = await supabase.from("jobs").update(jobData).eq("id", id).select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error("Error updating job:", error)
    return null
  }
}

export async function createApplication(applicationData: any) {
  try {
    const { data, error } = await supabase.from("applications").insert([applicationData]).select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error("Error creating application:", error)
    return null
  }
}

export async function getApplications(userId: string) {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*, job:jobs(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error fetching applications:", error)
    return []
  }
}

export async function updateApplicationStatus(id: number, status: string) {
  try {
    const { data, error } = await supabase.from("applications").update({ status }).eq("id", id).select()

    if (error) throw error
    return data?.[0] || null
  } catch (error) {
    console.error("Error updating application status:", error)
    return null
  }
}

