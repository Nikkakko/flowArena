/* export const addTodo = async ({ userId, title, completed }) => {
    await delay()
    if (Math.random() < 0.5) throw new Error("Failed to add new item!")
    const response = await todosApi.post(todosUrlEndpoint, { userId, title, completed })
    return response.data
} */

interface AddVoteToBattle {
  battleId: string;
  userId: string;
}

export const addVoteToBattle = async ({
  battleId,
  userId,
}: AddVoteToBattle) => {
  try {
    const response = await fetch("/api/votes", {
      method: "POST",
      body: JSON.stringify({ battleId, userId }),
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error("Failed to add vote to battle");
    }

    return await response.json();
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return { error: "An unexpected error occurred" };
  }
};
