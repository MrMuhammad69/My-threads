import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex, Skeleton, VStack } from "@chakra-ui/react";
import Post from "../Components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/posts.atom";
import SuggestedUsers from "../Components/SuggestedUsers";

const Homepage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        if (Array.isArray(data)) {
          const nonFrozenPosts = data.filter(post => !post.postedBy.isFrozen);
          setPosts(nonFrozenPosts);
        } else {
          showToast("Error", "Unexpected data format", "error");
          setPosts([]);
        }
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap={10} alignItems={'flex-start'}>
      <Box flex={70}>
        {/* Show Skeleton Loader if loading */}
        {loading && (
          <VStack spacing={6}>
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height="100px" width="full" borderRadius="md" />
            ))}
          </VStack>
        )}

        {/* Show message if no posts and not loading */}
        {!loading && posts.length === 0 && (
          <h1>Follow some users to see their posts in the feed</h1>
        )}

        {/* Render posts after loading is complete */}
        {!loading && Array.isArray(posts) && posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>

      {/* Suggested Users Section */}
      <Box
        flex={30}
        display={{
          base: "none",
          md: "block"
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default Homepage;
