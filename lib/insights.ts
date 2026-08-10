// lib/insights.ts

import * as mongoose from 'mongoose';
import { Entry } from '@/models/Entry';

/**
 * Calculates and constructs a prompt text for user insights based on the last 7 entries.
 * @param userId The ID of the authenticated user.
 * @returns A string containing mood scores and task completion rates from the last 7 entries.
 */
export async function constructPromptText(userId: mongoose.Types.ObjectId): Promise<string> {
  try {
    // Fetch the last 7 entries for the authenticated user
    const entries = await Entry.find({ userId }).sort({ createdAt: -1 }).limit(7);

    if (entries.length === 0) {
      return "No entries found.";
    }

    let promptText = "Here are your insights from the last 7 days:\n";

    for (const entry of entries) {
      const moodScore = entry.mood;
      const taskCompletionRate = entry.tasksCompleted / entry.totalTasks * 100;

      promptText += `Entry date: ${entry.createdAt.toLocaleDateString()}, Mood Score: ${moodScore}, Task Completion Rate: ${taskCompletionRate.toFixed(2)}%\n`;
    }

    return promptText;
  } catch (error) {
    console.error("Error constructing prompt text:", error);
    throw new Error("Failed to construct prompt text.");
  }
}

/**
 * Defines an interface for the Entry model.
 */
export interface Entry {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  mood: number;
  tasksCompleted: number;
  totalTasks: number;
}