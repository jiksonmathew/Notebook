import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

function Notebook() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [openSubjects, setOpenSubjects] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubjects = async () => {
    const res = await axios.get("https://notebook-backend-aveb.onrender.com/api/subjects");
    setSubjects(res.data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const updateSubject = async (subject) => {
    await axios.put(
      `https://notebook-backend-aveb.onrender.com/api/subjects/${subject._id}`,
      subject
    );
    fetchSubjects();
  };

  // Subject actions
  const addSubject = async () => {
    if (!newSubject.trim()) return alert("Enter subject name");
    await axios.post("https://notebook-backend-aveb.onrender.com/api/subjects", {
      name: newSubject.trim(),
      topics: [],
    });
    setNewSubject("");
    fetchSubjects();
  };

  const editSubject = async (subject) => {
    const name = prompt("Edit subject name:", subject.name);
    if (name && name.trim()) {
      subject.name = name.trim();
      await updateSubject(subject);
    }
  };

  const deleteSubject = async (subjectId) => {
    if (!window.confirm("Delete this subject?")) return;
    await axios.delete(`https://notebook-backend-aveb.onrender.com/api/subjects/${subjectId}`);
    fetchSubjects();
  };

  // Collapse state helpers
  const toggleOpen = (type, subjectId, indexPath) => {
    const key = `${type}-${subjectId}-${indexPath.join("-")}`;
    setOpenSubjects((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const isOpen = (type, subjectId, indexPath) => {
    const key = `${type}-${subjectId}-${indexPath.join("-")}`;
    return !!openSubjects[key];
  };

  // Topic actions
  const addTopic = (subject) => {
    const title = prompt("Enter topic title:");
    if (!title) return;
    subject.topics.push({ title: title.trim(), categories: [] });
    updateSubject(subject);
  };

  const editTopic = (subject, topic) => {
    const title = prompt("Edit topic title:", topic.title);
    if (title && title.trim()) {
      topic.title = title.trim();
      updateSubject(subject);
    }
  };

  const deleteTopic = (subject, topicIndex) => {
    if (!window.confirm("Delete this topic?")) return;
    subject.topics.splice(topicIndex, 1);
    updateSubject(subject);
  };

  // Category actions
  const addCategory = (subject, topic) => {
    const name = prompt("Enter category name:");
    if (!name) return;
    topic.categories.push({
      name: name.trim(),
      details: [],
      subCategories: [],
    });
    updateSubject(subject);
  };

  const editCategory = (subject, topic, category) => {
    const name = prompt("Edit category name:", category.name);
    if (name && name.trim()) {
      category.name = name.trim();
      updateSubject(subject);
    }
  };

  const deleteCategory = (subject, topic, categoryIndex) => {
    if (!window.confirm("Delete this category?")) return;
    topic.categories.splice(categoryIndex, 1);
    updateSubject(subject);
  };

  // SubCategory actions
  const addSubCategory = (subject, topic, category) => {
    const name = prompt("Enter sub-category name:");
    if (!name) return;
    category.subCategories.push({ name: name.trim(), details: [] });
    updateSubject(subject);
  };

  const editSubCategory = (subject, topic, category, subCategory) => {
    const name = prompt("Edit sub-category name:", subCategory.name);
    if (name && name.trim()) {
      subCategory.name = name.trim();
      updateSubject(subject);
    }
  };

  const deleteSubCategory = (subject, topic, category, subCategoryIndex) => {
    if (!window.confirm("Delete this sub-category?")) return;
    category.subCategories.splice(subCategoryIndex, 1);
    updateSubject(subject);
  };

  // Detail actions
  const addDetail = (subject, topic, parent) => {
    const text = prompt("Enter detail:");
    if (!text) return;
    parent.details.push({ text: text.trim() });
    updateSubject(subject);
  };

  const editDetail = (subject, topic, parent, detail) => {
    const text = prompt("Edit detail:", detail.text);
    if (text && text.trim()) {
      detail.text = text.trim();
      updateSubject(subject);
    }
  };

  const deleteDetail = (subject, topic, parent, detailIndex) => {
    if (!window.confirm("Delete this detail?")) return;
    parent.details.splice(detailIndex, 1);
    updateSubject(subject);
  };

  // Filter subjects by searchTerm on subject.name or topic.title
  const filteredSubjects = subjects.filter((subject) => {
    const term = searchTerm.toLowerCase();
    if (subject.name.toLowerCase().includes(term)) return true;
    return subject.topics.some((t) => t.title.toLowerCase().includes(term));
  });

  return (
    <div className="container mt-4">
      {/* Search Box */}
      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="Search by subject or topic"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add Subject */}
      <div className="input-group mb-4">
        <input
          className="form-control"
          placeholder="Add new subject"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addSubject}>
          <FaPlus /> Add Subject
        </button>
      </div>

      {/* Subjects List */}
      {filteredSubjects.map((subject, sIdx) => (
        <div key={subject._id} className="card mb-3">
          <div className="card-body">
            <h5>
              <span
                role="button"
                onClick={() => toggleOpen("subject", subject._id, [sIdx])}>
                {isOpen("subject", subject._id, [sIdx]) ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
              </span>{" "}
              {subject.name}{" "}
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => editSubject(subject)}>
                <FaEdit />
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => deleteSubject(subject._id)}>
                <FaTrash />
              </button>
            </h5>

            {isOpen("subject", subject._id, [sIdx]) && (
              <>
                <button
                  className="btn btn-sm btn-outline-success mb-2"
                  onClick={() => addTopic(subject)}>
                  <FaPlus /> Add Topic
                </button>

                {subject.topics
                  .filter(
                    (topic) =>
                      topic.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      subject.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((topic, tIdx) => (
                    <div key={tIdx} className="ms-3 mb-3">
                      <h6>
                        <span
                          role="button"
                          onClick={() =>
                            toggleOpen("topic", subject._id, [sIdx, tIdx])
                          }>
                          {isOpen("topic", subject._id, [sIdx, tIdx]) ? (
                            <FaChevronDown />
                          ) : (
                            <FaChevronRight />
                          )}
                        </span>{" "}
                        {topic.title}{" "}
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => editTopic(subject, topic)}>
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteTopic(subject, tIdx)}>
                          <FaTrash />
                        </button>
                      </h6>

                      {isOpen("topic", subject._id, [sIdx, tIdx]) && (
                        <>
                          <button
                            className="btn btn-sm btn-outline-warning mb-1"
                            onClick={() => addCategory(subject, topic)}>
                            <FaPlus /> Add Category
                          </button>

                          {topic.categories.map((cat, cIdx) => (
                            <div key={cIdx} className="ms-4 mb-2">
                              <strong>
                                <span
                                  role="button"
                                  onClick={() =>
                                    toggleOpen("category", subject._id, [
                                      sIdx,
                                      tIdx,
                                      cIdx,
                                    ])
                                  }>
                                  {isOpen("category", subject._id, [
                                    sIdx,
                                    tIdx,
                                    cIdx,
                                  ]) ? (
                                    <FaChevronDown />
                                  ) : (
                                    <FaChevronRight />
                                  )}
                                </span>{" "}
                                {cat.name}{" "}
                                <button
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() =>
                                    editCategory(subject, topic, cat)
                                  }>
                                  <FaEdit />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    deleteCategory(subject, topic, cIdx)
                                  }>
                                  <FaTrash />
                                </button>
                              </strong>

                              {isOpen("category", subject._id, [
                                sIdx,
                                tIdx,
                                cIdx,
                              ]) && (
                                <>
                                  <button
                                    className="btn btn-sm btn-outline-info ms-2 mb-1"
                                    onClick={() =>
                                      addDetail(subject, topic, cat)
                                    }>
                                    <FaPlus /> Add Detail
                                  </button>
                                  <ul>
                                    {cat.details.map((d, dIdx) => (
                                      <li key={dIdx}>
                                        {d.text}{" "}
                                        <button
                                          className="btn btn-sm btn-outline-primary ms-1"
                                          onClick={() =>
                                            editDetail(subject, topic, cat, d)
                                          }>
                                          <FaEdit />
                                        </button>
                                        <button
                                          className="btn btn-sm btn-outline-danger ms-1"
                                          onClick={() =>
                                            deleteDetail(
                                              subject,
                                              topic,
                                              cat,
                                              dIdx
                                            )
                                          }>
                                          <FaTrash />
                                        </button>
                                      </li>
                                    ))}
                                  </ul>

                                  {/* Subcategories */}
                                  <div className="ms-4 mt-2">
                                    <button
                                      className="btn btn-sm btn-outline-secondary mb-1"
                                      onClick={() =>
                                        addSubCategory(subject, topic, cat)
                                      }>
                                      <FaPlus /> Add Sub-Category
                                    </button>

                                    {cat.subCategories.map((subCat, scIdx) => (
                                      <div key={scIdx} className="mb-2">
                                        <strong>
                                          <span
                                            role="button"
                                            onClick={() =>
                                              toggleOpen(
                                                "subcat",
                                                subject._id,
                                                [sIdx, tIdx, cIdx, scIdx]
                                              )
                                            }>
                                            {isOpen("subcat", subject._id, [
                                              sIdx,
                                              tIdx,
                                              cIdx,
                                              scIdx,
                                            ]) ? (
                                              <FaChevronDown />
                                            ) : (
                                              <FaChevronRight />
                                            )}
                                          </span>{" "}
                                          {subCat.name}{" "}
                                          <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() =>
                                              editSubCategory(
                                                subject,
                                                topic,
                                                cat,
                                                subCat
                                              )
                                            }>
                                            <FaEdit />
                                          </button>
                                          <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                              deleteSubCategory(
                                                subject,
                                                topic,
                                                cat,
                                                scIdx
                                              )
                                            }>
                                            <FaTrash />
                                          </button>
                                        </strong>

                                        {isOpen("subcat", subject._id, [
                                          sIdx,
                                          tIdx,
                                          cIdx,
                                          scIdx,
                                        ]) && (
                                          <>
                                            <button
                                              className="btn btn-sm btn-outline-info ms-2 mb-1"
                                              onClick={() =>
                                                addDetail(
                                                  subject,
                                                  topic,
                                                  subCat
                                                )
                                              }>
                                              <FaPlus /> Add Detail
                                            </button>
                                            <ul>
                                              {subCat.details.map((d, dIdx) => (
                                                <li key={dIdx}>
                                                  {d.text}{" "}
                                                  <button
                                                    className="btn btn-sm btn-outline-primary ms-1"
                                                    onClick={() =>
                                                      editDetail(
                                                        subject,
                                                        topic,
                                                        subCat,
                                                        d
                                                      )
                                                    }>
                                                    <FaEdit />
                                                  </button>
                                                  <button
                                                    className="btn btn-sm btn-outline-danger ms-1"
                                                    onClick={() =>
                                                      deleteDetail(
                                                        subject,
                                                        topic,
                                                        subCat,
                                                        dIdx
                                                      )
                                                    }>
                                                    <FaTrash />
                                                  </button>
                                                </li>
                                              ))}
                                            </ul>
                                          </>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notebook;
