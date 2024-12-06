import React, { useEffect, useState } from "react";

interface User {
  name: string | null;
  avatar_url: string | null;
  created_at: string | null;
  bio: string | null;
  repos_url: string | null;
  followers_url: string | null;
  following_url: string | null;
  location: string | null;
  company: string | null;
}

const fetchGitHubUser = async (username: string): Promise<User> => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  const response = await fetch(`https://api.github.com/users/${username}`, {
    method: "GET",
    headers: {
      Authorization: `token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    name: data.name,
    avatar_url: data.avatar_url,
    created_at: data.created_at,
    bio: data.bio,
    repos_url: data.repos_url,
    followers_url: data.followers_url,
    following_url: data.following_url,
    location: data.location,
    company: data.company,
  };
};

// Function to fetch count of repos, followers, or following using async/await
const fetchDataCount = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }
  const data = await response.json();
  return data.length; // Return number of items
};

export default function GithubCard() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("GGiunashvili");

  const [reposCount, setReposCount] = useState<number | null>(null);
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [followingCount, setFollowingCount] = useState<number | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      setError(null); // Reset any previous error

      try {
        const userData = await fetchGitHubUser(username);
        setUser(userData);

        // Use Promise.all to fetch all counts simultaneously
        const [repoCount, followersCountResult, followingCountResult] =
          await Promise.all([
            userData.repos_url
              ? fetchDataCount(userData.repos_url)
              : Promise.resolve(0),
            userData.followers_url
              ? fetchDataCount(userData.followers_url)
              : Promise.resolve(0),
            userData.following_url
              ? fetchDataCount(
                  userData.following_url.replace("{/other_user}", "")
                )
              : Promise.resolve(0),
          ]);

        setReposCount(repoCount);
        setFollowersCount(followersCountResult);
        setFollowingCount(followingCountResult);
      } catch (err: any) {
        setError(err.message);
        setUser(null); // Clear user data if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      loadUser();
    }
  }, [username]); // Re-run when username changes

  return (
    <>
      <input
        onChange={(event) => setUsername(event.target.value)} // Updates username and triggers re-fetch
        type="text"
        placeholder="Enter GitHub username"
        className="bg-blue-200 p-2 mb-4"
        value={username}
      />
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {user && (
        <div className="max-w-screen-lg mx-auto grid grid-cols-6 gap-4">
          <div className="col-start-1 col-end-3 bg-purple-100 grid place-items-center">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={`${user.name}'s avatar`}
                className="rounded-full"
                style={{ width: "100px", height: "100px" }}
              />
            ) : (
              "No Avatar"
            )}
          </div>
          <div className="col-end-7 col-span-4 bg-purple-100">
            {user.name || "No Name Provided"}
          </div>
          <div className="col-end-7 col-span-4 bg-purple-100">
            {user.created_at
              ? `Created at: ${new Date(user.created_at).toLocaleDateString()}`
              : "No Creation Date"}
          </div>
          <div className="col-end-7 col-span-4 bg-purple-100">
            {user.bio || "No Bio Available"}
          </div>

          <div className="col-end-7 col-span-4 bg-purple-100">
            <p>Repos: {reposCount !== null ? reposCount : "Loading..."}</p>
            <p>
              Followers:{" "}
              {followersCount !== null ? followersCount : "Loading..."}
            </p>
            <p>
              Following:{" "}
              {followingCount !== null ? followingCount : "Loading..."}
            </p>
          </div>

          <div className="col-end-7 col-span-4 bg-purple-100">
            <p> {user.location || "No Bio Available"}</p>
            <p> {user.company || "No Bio Available"}</p>
          </div>
        </div>
      )}
    </>
  );
}
