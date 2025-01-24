const videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 1,
    createdAt: "2 minutes age",
    views: 1,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 4,
    comments: 2,
    createdAt: "2 minutes age",
    views: 29,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 3,
    comments: 3,
    createdAt: "2 minutes age",
    views: 39,
    id: 3,
  },
];

export const trending = (req, res) => res.render("home", { pageTitle: "home", videos });

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching: ${video.title}`, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
}

export const postUpload = (req, res) => {
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 5,
    comments: 2,
    createdAt: "just now",
    views: 1,
    id: videos.length + 1,
  };
  videos.push(newVideo)
  return res.redirect("/");
}
