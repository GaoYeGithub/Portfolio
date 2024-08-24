import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Avatar,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";

interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
}

const Home: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=3`);
      const newPosts = await response.json();
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <Head>
        <title>My Portfolio</title>
        <meta name="description" content="Welcome to my portfolio website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 4,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Avatar
          alt="Ye Gao"
          src="/public/vercel.svg"
          sx={{ width: 150, height: 150, marginBottom: 2 }}
        />
        <Typography variant="h2" color="textPrimary" component="h1" gutterBottom>
          Ye Gao
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Aspiring Full Stack Development
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: 600, mb: 3 }}>
          Hello!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          href="/portfolio"
        >
          View My Work
        </Button>
      </Box>

      <Box sx={{ padding: 4 }}>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={<CircularProgress />}
          endMessage={
            <Typography variant="body1" textAlign="center" mt={2}>
              No more posts to load.
            </Typography>
          }
        >
          <Grid container spacing={4}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.image}
                    alt={post.title}
                  />
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </Box>
    </div>
  );
};

export default Home;