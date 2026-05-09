export async function postToDiscord(
  channelId: string,
  content: string,
  token: string,
): Promise<void> {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `Discord API error ${res.status}: ${body}`,
    );
  }

  console.log("Message sent to Discord.");
}
