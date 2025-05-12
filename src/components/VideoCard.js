import React from 'react';

const VideoCard = ({ video }) => (
  <div className="video-card">
    <iframe
      width="100%"
      height="200"
      src={`https://www.youtube.com/embed/${video.id}`}
      title={video.title}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
    <p>{video.title}</p>
  </div>
);

export default VideoCard;