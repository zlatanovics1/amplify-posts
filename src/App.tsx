import { useEffect, useState } from "react";
import Auth from "./components/Auth";
import { get } from "@aws-amplify/api";
function App() {
  const [posts, setPosts] = useState([]);

  useEffect(function () {
    async function fetchPosts() {
      const { response } = get({ apiName: "postsapi", path: "/posts" });
      const { body } = await response;
      const posts = await body.json();
      console.log(posts);
    }
    fetchPosts();
  }, []);
  return (
    <div>
      <Auth />
    </div>
  );
}

export default App;
