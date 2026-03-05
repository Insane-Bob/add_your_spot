import { ObjectId } from "mongodb"
import clientPromise from "../lib/mongo.js"

export default async function handler(req, res) {
  try {
    const client = await clientPromise
    const db = client.db("mapdb")
    const collection = db.collection("points")

    // GET - Récupérer tous les points
    if (req.method === "GET") {
      const points = await collection.find({}).toArray()
      return res.status(200).json(points)
    }

    // POST - Ajouter un nouveau point
    if (req.method === "POST") {
      const point = {
        ...req.body,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const result = await collection.insertOne(point)
      return res.status(201).json({ ...point, _id: result.insertedId })
    }

    // PUT - Mettre à jour un point
    if (req.method === "PUT") {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: "ID required" })

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            ...req.body,
            updatedAt: new Date()
          }
        }
      )

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Point not found" })
      }

      return res.status(200).json({ success: true })
    }

    // DELETE - Supprimer un point
    if (req.method === "DELETE") {
      const { id } = req.query
      if (!id) return res.status(400).json({ error: "ID required" })

      const result = await collection.deleteOne({ _id: new ObjectId(id) })

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Point not found" })
      }

      return res.status(200).json({ success: true })
    }

    return res.status(405).json({ error: "Method not allowed" })

  } catch (error) {
    console.error("API Error:", error)
    return res.status(500).json({ error: error.message })
  }
}

