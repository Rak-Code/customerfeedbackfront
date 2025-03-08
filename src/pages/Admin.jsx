import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [allFeedback, setAllFeedback] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const navigate = useNavigate();

  const fetchAllFeedback = async () => {
    const response = await fetch("http://localhost:8080/api/feedback");
    const data = await response.json();
    setAllFeedback(data);
  };

  const editFeedback = (id, content) => {
    setEditingId(id);
    setEditContent(content);
  };

  const updateFeedback = async (id) => {
    await fetch(`http://localhost:8080/api/feedback/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    });

    setEditingId(null);
    fetchAllFeedback();
  };

  const deleteFeedback = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      await fetch(`http://localhost:8080/api/feedback/delete/${id}`, {
        method: "DELETE",
      });
      fetchAllFeedback();
    }
  };

  useEffect(() => {
    fetchAllFeedback();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Feedback Dashboard</h2>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Feedback</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allFeedback.map((fb) => (
            <tr key={fb.id} className="border-b">
              <td className="py-2 px-4">{fb.id}</td>
              <td className="py-2 px-4">
                {editingId === fb.id ? (
                  <textarea
                    className="w-full border p-1"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                ) : (
                  fb.content
                )}
              </td>
              {/* <td className="py-2 px-4">{fb.date}</td> */}
              <td className="py-2 px-4">{new Date(fb.createdAt).toLocaleString()}</td>

              <td className="py-2 px-4">
                {editingId === fb.id ? (
                  <>
                    <button
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      onClick={() => updateFeedback(fb.id)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-200 text-gray-700 px-2 py-1 ml-2 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      onClick={() => editFeedback(fb.id, fb.content)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-gray-200 text-gray-700 px-2 py-1 ml-2 rounded"
                      onClick={() => deleteFeedback(fb.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="w-full bg-gray-200 text-gray-700 px-4 py-2 mt-6 rounded"
        onClick={() => navigate("/login")}
      >
        Logout
      </button>
    </div>
  );
};

export default Admin;