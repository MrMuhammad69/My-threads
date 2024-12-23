import { useEffect, useState } from "react";
import UserHeader from "../Components/UserHeader.jsx";
import { useParams } from "react-router";
import useShowToast from "../hooks/useShowToast.js";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../Components/Post.jsx";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/posts.atom.js";
import useGetUserProfile from "../hooks/useGetUserProfile.js";

const UserPage = () => {
  const {user, loading} = useGetUserProfile()
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom)
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    const getPosts = async () => { 
      if(!user) return
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, 'error');
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [username, showToast, setPosts, user]);
  if (loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user) {
    return <div className="not-found"><h1>User not found</h1></div>;
  }

  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>
        User has no posts.
      </h1> }
      {fetchingPosts &&(
        <Flex justifyContent={'center'} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      ) }
      {posts.map((post)=> (
        <Post key={post._id} post={post} postedBy={post.postedBy} setPosts={setPosts}/>
      ))}
    </>
  );
};

export default UserPage;
