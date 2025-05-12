import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Button, ButtonGroup, Pagination, Spinner, Form, Alert } from 'react-bootstrap';
import '../styles/Pages.css';

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const MAX_RESULTS = 12;

const MediaPage = ({ 
  onReturnToModeSelect, 
  pageTitle, 
  defaultQuery, 
  categories 
}) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState(defaultQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageTokens, setPageTokens] = useState({ 1: '' });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const cacheRef = useRef({});
  const isFetchingRef = useRef(false);

  const fetchVideos = useCallback(async (searchTerm, pageToken = '', pageNumber = 1) => {
    if (pageNumber > 2) return;

    const cacheKey = `${searchTerm}-${pageNumber}`;
    if (cacheRef.current[cacheKey]) {
      setVideos(cacheRef.current[cacheKey]);
      setCurrentPage(pageNumber);
      return;
    }

    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: API_KEY,
          q: searchTerm,
          part: 'snippet',
          maxResults: MAX_RESULTS,
          type: 'video',
          safeSearch: 'strict',
          videoDuration: 'long',
          pageToken: pageToken
        }
      });

      const items = response.data.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url
      }));

      cacheRef.current[cacheKey] = items;
      setVideos(items);

      if (pageNumber === 1 && response.data.nextPageToken) {
        setPageTokens({ 1: '', 2: response.data.nextPageToken });
      }

      setCurrentPage(pageNumber);
    } catch (err) {
      console.error(err);
      setError('Error loading video. Check your API key.');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchVideos(query, '', 1);
  }, [query, fetchVideos]);

  const handleCategoryClick = (category) => {
    setQuery(category);
    setCurrentPage(1);
    setPageTokens({ 1: '' });
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > 2) return;
    const token = pageTokens[page];
    if (token !== undefined) {
      fetchVideos(query, token, page);
    }
  };

  const handleReturn = () => {
    navigate('/');
    if (onReturnToModeSelect) {
      onReturnToModeSelect();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Container className="media-page-container">
      <Button 
        variant="outline-secondary" 
        onClick={handleReturn} 
        className="mb-3 glass-return-button"
      >
        <i className="bi bi-arrow-left"></i> Return to selection
      </Button>

      <h1 className="text-center mb-4 page-title">{pageTitle}</h1>

      {isMobile ? (
        <Form.Select
          className="mb-4 category-select"
          value={query}
          onChange={(e) => handleCategoryClick(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </Form.Select>
      ) : (
        <ButtonGroup className="d-flex flex-wrap justify-content-center mb-4 category-buttons">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={cat === query ? 'primary' : 'outline-primary'}
              onClick={() => handleCategoryClick(cat)}
              className="m-1 category-button"
            >
              {cat}
            </Button>
          ))}
        </ButtonGroup>
      )}

      {loading && (
        <div className="text-center my-4 loading-spinner">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {error && (
        <Alert variant="danger" className="text-center error-message">
          {error}
        </Alert>
      )}

      <Row className="video-grid">
        {videos.map(video => (
          <Col key={video.id} xs={12} md={6} lg={4} className="mb-4 video-col">
            <div className="video-card">
              <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <p className="mt-2 video-title">{video.title}</p>
            </div>
          </Col>
        ))}
      </Row>

      <Pagination className="justify-content-center mt-4 pagination">
        {currentPage > 1 && (
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
        )}
        {[1, 2].map(page => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Pagination.Item>
        ))}
        {currentPage < 2 && pageTokens[2] && (
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
        )}
      </Pagination>
    </Container>
  );
};

export default MediaPage;