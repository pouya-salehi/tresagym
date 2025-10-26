"use client";
import { useEffect, useState } from "react";
function DashboardPage({ id }) {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/users/${id}`);
      const data = await res.json();
      if (data.status === "success") {
        setUser(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  if (!user) return <div>Loading...</div>;

  return <div>سلام {user.name}</div>;
}
export default DashboardPage;
