import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://forum-backend-m2o6.onrender.com/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const fetchQuestions = (categoryId) => {
    setSelectedCategoryId(categoryId);
    axios.get(`https://forum-backend-m2o6.onrender.com/api/questions/${categoryId}`)
      .then(res => setQuestions(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://forum-backend-m2o6.onrender.com/api/questions', {
        category: selectedCategoryId,
        author: username,
        question: questionText,
      });
      setQuestionText('');
      fetchQuestions(selectedCategoryId);
    } catch (err) {
      alert('Error posting question');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="container">
      <h2>Welcome, {username}!</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Categories</h3>
      <div className="category-list">
        {categories.map(cat => (
          <button key={cat._id} onClick={() => fetchQuestions(cat._id)}>
            {cat.name}
          </button>
        ))}
      </div>

      {selectedCategoryId && (
        <div>
          <h3>Ask a Question</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Type your question here"
              required
            />
            <button type="submit">Submit Question</button>
          </form>

          <h3>Questions</h3>
          <ul>
            {questions.map(q => (
              <li key={q._id}>
                <strong>{q.author}:</strong> {q.question}
                {q.answer && (
                  <div><em>Answer:</em> {q.answer}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
