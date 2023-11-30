import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import EditPostWidget from "./EditPostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const getUserPosts = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/posts/${userId}/posts`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [isProfile, userId]); // Updated the dependencies

  const [editPostId, setEditPostId] = useState(null);

  const handleEditClick = (postId) => {
    setEditPostId(postId);
  };

  const handleDeleteClick = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        // Remove the deleted post from the Redux store
        const updatedPosts = posts.filter((post) => post._id !== postId);
        dispatch(setPosts({ posts: updatedPosts }));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditClose = () => {
    setEditPostId(null);
  };

  // Ensure posts is an array before mapping
  const renderPosts = Array.isArray(posts) ? posts : [];

  return (
    <>
      {renderPosts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <React.Fragment key={_id}>
            <PostWidget
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
              userId={userId}
              handleEditClick={handleEditClick}
              handleDeleteClick={handleDeleteClick}
            />
            {editPostId === _id && (
              <EditPostWidget
                postId={_id}
                description={posts.find((post) => post._id === editPostId)?.description}
                picturePath={posts.find((post) => post._id === editPostId)?.picturePath}
                onClose={handleEditClose}
              />
            )}
          </React.Fragment>
        )
      )}
    </>
  );
};

export default PostsWidget;
