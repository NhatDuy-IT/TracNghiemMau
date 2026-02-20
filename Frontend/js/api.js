// API Configuration
const BASE_URL = 'http://localhost:3000/api';

// Helper function for API calls with authentication
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    };

    const response = await fetch(url, config);
    
    // Handle token expiration
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
        throw new Error('Token expired');
    }

    return response;
}

// Auth API
const authAPI = {
    login: (username, password) => 
        fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }),
    
    register: (username, password, fullName, email) =>
        fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, fullName, email })
        })
};

// User API
const userAPI = {
    getSubjects: () => authenticatedFetch(`${BASE_URL}/user/subjects`),
    
    getQuestions: (subjectId) => authenticatedFetch(`${BASE_URL}/user/questions/${subjectId}`),
    
    submitExam: (subjectId, answers) => authenticatedFetch(`${BASE_URL}/user/exam/submit`, {
        method: 'POST',
        body: JSON.stringify({ subjectId, answers })
    }),
    
    getExamHistory: () => authenticatedFetch(`${BASE_URL}/user/exam-history`),
    
    // Profile
    getProfile: () => authenticatedFetch(`${BASE_URL}/user/profile`),
    
    updateProfile: (data) => authenticatedFetch(`${BASE_URL}/user/profile`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    changePassword: (data) => authenticatedFetch(`${BASE_URL}/user/change-password`, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
};

// Admin API
const adminAPI = {
    // Subjects
    getSubjects: () => authenticatedFetch(`${BASE_URL}/admin/subjects`),
    getSubject: (id) => authenticatedFetch(`${BASE_URL}/admin/subjects/${id}`),
    createSubject: (data) => authenticatedFetch(`${BASE_URL}/admin/subjects`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateSubject: (id, data) => authenticatedFetch(`${BASE_URL}/admin/subjects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteSubject: (id) => authenticatedFetch(`${BASE_URL}/admin/subjects/${id}`, {
        method: 'DELETE'
    }),
    
    // Questions
    getQuestions: (subjectId) => {
        const url = subjectId ? `${BASE_URL}/admin/questions?subjectId=${subjectId}` : `${BASE_URL}/admin/questions`;
        return authenticatedFetch(url);
    },
    getQuestion: (id) => authenticatedFetch(`${BASE_URL}/admin/questions/${id}`),
    createQuestion: (data) => authenticatedFetch(`${BASE_URL}/admin/questions`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateQuestion: (id, data) => authenticatedFetch(`${BASE_URL}/admin/questions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    deleteQuestion: (id) => authenticatedFetch(`${BASE_URL}/admin/questions/${id}`, {
        method: 'DELETE'
    }),
    
    // Exam History
    getAllExamHistory: () => authenticatedFetch(`${BASE_URL}/admin/exam-history`)
};

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}
