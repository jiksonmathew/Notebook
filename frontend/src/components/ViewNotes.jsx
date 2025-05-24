import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function ViewNotes() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("https://notebook-backend-aveb.onrender.com/api/subjects");
        setSubjects(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchSubjects();
  }, []);

  // Filtering subjects by search on subject name, topic title, category name
  // But when matched, keep all subcategories and details intact (no filtering down)
  const filterSubjects = (subjects) => {
    if (!search.trim()) return subjects;

    const lowerSearch = search.toLowerCase();

    return subjects
      .map((subject) => {
        // Check if subject matches search
        const subjectMatches = subject.name.toLowerCase().includes(lowerSearch);

        // Filter topics that match topic title or categories
        const matchedTopics = (subject.topics || []).filter((topic) => {
          if (topic.title.toLowerCase().includes(lowerSearch)) return true;

          // Check if any category matches search
          if (
            topic.categories?.some((category) =>
              category.name.toLowerCase().includes(lowerSearch)
            )
          )
            return true;

          return false;
        });

        // If subject matches OR some topics matched, include this subject
        if (subjectMatches || matchedTopics.length > 0) {
          // For matched topics, include all categories fully (no filtering inside categories)
          const topicsWithFullCategories = matchedTopics.map((topic) => ({
            ...topic,
            categories: topic.categories || [],
          }));

          return {
            ...subject,
            topics: topicsWithFullCategories,
          };
        }

        // Else exclude subject
        return null;
      })
      .filter(Boolean);
  };

  const filteredSubjects = filterSubjects(subjects);

  // Render details inside category or subcategory — no filtering here
  const renderDetails = (parent) => {
    if (!parent.details || parent.details.length === 0) return null;
    return (
      <ul className="list-group list-group-flush ms-3">
        {parent.details.map((detail, idx) => (
          <li key={idx} className="list-group-item">
            {detail.text}
          </li>
        ))}
      </ul>
    );
  };

  // Render subcategories accordion — no filtering here
  const renderSubCategories = (subCategories, catId) => {
    if (!subCategories || subCategories.length === 0) return null;

    return (
      <div className="accordion mt-2 ms-3" id={`subcat-accordion-${catId}`}>
        {subCategories.map((subCat, idx) => {
          const subCatId = `${catId}-sub-${idx}`;
          return (
            <div key={subCatId} className="accordion-item">
              <h2 className="accordion-header" id={`heading-${subCatId}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${subCatId}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${subCatId}`}>
                  🔹 {subCat.name}
                </button>
              </h2>
              <div
                id={`collapse-${subCatId}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${subCatId}`}
                data-bs-parent={`#subcat-accordion-${catId}`}>
                <div className="accordion-body">{renderDetails(subCat)}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render categories accordion — show all categories fully
  const renderCategories = (categories, topicId) => {
    if (!categories || categories.length === 0) return null;

    return (
      <div className="accordion ms-3 mt-2" id={`cat-accordion-${topicId}`}>
        {categories.map((category, idx) => {
          const catId = `${topicId}-cat-${idx}`;
          return (
            <div key={catId} className="accordion-item">
              <h2 className="accordion-header" id={`heading-${catId}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${catId}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${catId}`}>
                  📁 {category.name}
                </button>
              </h2>
              <div
                id={`collapse-${catId}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${catId}`}
                data-bs-parent={`#cat-accordion-${topicId}`}>
                <div className="accordion-body">
                  {renderDetails(category)}
                  {renderSubCategories(category.subCategories, catId)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render topics accordion — show all matched topics fully with their categories
  const renderTopics = (topics, subjectId) => {
    if (!topics || topics.length === 0)
      return <p className="ms-3">No topics found.</p>;

    return (
      <div className="accordion ms-2" id={`topic-accordion-${subjectId}`}>
        {topics.map((topic, idx) => {
          const topicId = `${subjectId}-topic-${idx}`;
          return (
            <div key={topicId} className="accordion-item">
              <h2 className="accordion-header" id={`heading-${topicId}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${topicId}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${topicId}`}>
                  📌 {topic.title}
                </button>
              </h2>
              <div
                id={`collapse-${topicId}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${topicId}`}
                data-bs-parent={`#topic-accordion-${subjectId}`}>
                <div className="accordion-body">
                  {renderCategories(topic.categories, topicId)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by subject, topic or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredSubjects.length === 0 && <p>No notes found.</p>}

      <div className="accordion" id="subjectAccordion">
        {filteredSubjects.map((subject, idx) => {
          const subjectId = `subject-${idx}`;
          return (
            <div key={subject._id} className="accordion-item">
              <h2 className="accordion-header" id={`heading-${subjectId}`}>
                <button
                  className="accordion-button collapsed fw-bold"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${subjectId}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${subjectId}`}>
                  📚 {subject.name}
                </button>
              </h2>
              <div
                id={`collapse-${subjectId}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${subjectId}`}
                data-bs-parent="#subjectAccordion">
                <div className="accordion-body">
                  {renderTopics(subject.topics, subjectId)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ViewNotes;
