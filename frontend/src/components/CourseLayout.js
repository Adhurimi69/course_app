// src/Views/CourseLayout.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Button, Typography, Divider, Link, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import LectureModal from "../components/LectureModal";
import AssignmentModal from "../components/AssignmentModal";
import ExamModal from "../components/ExamModal";
import SingleStudentGradeDialog from "../components/SingleStudentGradeDialog";

export default function CourseLayout({ studentView = false }) {
  const { courseId } = useParams();
  const parsedUser = JSON.parse(localStorage.getItem("user") || "null") || {};
  const studentId = parsedUser?.id;
  const currentRole = localStorage.getItem("role") || parsedUser?.role;

  const [lectures, setLectures] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState({});

  const [openLectureModal, setOpenLectureModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);

  // UI open/expanded state for teacher compact view
  const [openLectureId, setOpenLectureId] = useState(null);
  const [openAssignmentId, setOpenAssignmentId] = useState(null);
  // compactMode: teacher in teacher view OR student in student view -> show compact lists that expand on click
  const compactMode = (currentRole === 'teacher' && !studentView) || (currentRole === 'student' && studentView);
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [currentLectureId, setCurrentLectureId] = useState(null);

  const [openExamModal, setOpenExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  // Grading UI state (per-course)
  const [assignmentGradesForCourse, setAssignmentGradesForCourse] = useState([]);
  const [courseGradesForCourse, setCourseGradesForCourse] = useState([]);
  // const [editingScores, setEditingScores] = useState({});
  const [studentsForCourse, setStudentsForCourse] = useState([]);
  const [, setStudentsFetchError] = useState(null);
  const [assignmentsForCourseFlat, setAssignmentsForCourseFlat] = useState([]);
  const [matrixEditing, setMatrixEditing] = useState({});
  const [assignmentAllGraderOpen, setAssignmentAllGraderOpen] = useState(false);
  const [assignmentToGradeAll, setAssignmentToGradeAll] = useState(null);
  const [assignmentAllEditing, setAssignmentAllEditing] = useState({});
  const [examAllGraderOpen, setExamAllGraderOpen] = useState(false);
  const [examToGradeAll, setExamToGradeAll] = useState(null);
  const [examAllEditing, setExamAllEditing] = useState({});
  const [assignmentPoints, setAssignmentPoints] = useState({});
  const [examPoints, setExamPoints] = useState({});
  const [studentExamsForCourse, setStudentExamsForCourse] = useState([]);
  const [studentGraderOpen, setStudentGraderOpen] = useState(false);
  const [studentToGrade, setStudentToGrade] = useState(null);

  // fetch all course data: lectures, assignments, exams, and uploads
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1) Fetch lectures
      const lecRes = await axios.get(`http://localhost:5000/api/queries/lectures/course/${courseId}`);
      const lecturesData = lecRes.data || [];

      // 2) Fetch assignments for all lectures
      const assignmentsPromises = lecturesData.map((lec) =>
        axios
          .get(`http://localhost:5000/api/queries/assignments/lecture/${lec.lectureId}`)
          .then((res) => res.data || [])
          .catch((err) => {
            console.error('Assignments fetch failed for lecture', lec.lectureId, err);
            return [];
          })
      );
      const assignmentsData = await Promise.all(assignmentsPromises);

      // 3) Fetch all uploads for the course at once
      const uploadsRes = await axios.get(`http://localhost:5000/api/queries/uploads/course/${courseId}`);
      const allUploads = uploadsRes.data || [];

      // 4) Map uploads to lectures and assignments
      const lecturesWithAssignments = lecturesData.map((lec, i) => {
        const lectureUploads = allUploads.filter((u) => String(u.lectureId) === String(lec.lectureId));
        const assignments = (assignmentsData[i] || []).map((a) => {
          const assignmentUploads = allUploads.filter((u) => String(u.assignmentId) === String(a.assignmentId));
          return { ...a, uploads: assignmentUploads };
        });
        return { ...lec, assignments, uploads: lectureUploads };
      });

      setLectures(lecturesWithAssignments);

      // 5) Fetch exams and attach uploads
      const examRes = await axios.get(`http://localhost:5000/api/queries/exams/course/${courseId}`);
      const examsData = examRes.data || [];
      const examsWithUploads = examsData.map((e) => {
        const examUploads = allUploads.filter((u) => String(u.examId) === String(e.examId));
        return { ...e, uploads: examUploads };
      });
      setExams(examsWithUploads);

      // compute flat assignments list for easy access
      const flatAssigns = lecturesWithAssignments.flatMap(l => l.assignments || []);
      setAssignmentsForCourseFlat(flatAssigns);

      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load course details.');
      } finally {
        setLoading(false);
      }
  };

  // fetch grade read-models and build student list + points maps
  const fetchGrades = async () => {
    try {
      const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
      const token = localStorage.getItem('accessToken');

      let allAssignGrades = [];
      let allGrades = [];
      let allStudentExams = [];
      console.debug('fetchGrades: trying unprotected /dev endpoints first');
      try {
        const devAssign = await axios.get(`${base}/api/queries/assignment-grade/dev`).catch(() => null);
        const devGrades = await axios.get(`${base}/api/queries/grade/dev`).catch(() => null);
        const devStudentExams = await axios.get(`${base}/api/queries/student-exam/dev`).catch(() => null);
        if (devAssign && devAssign.data) allAssignGrades = devAssign.data;
        if (devGrades && devGrades.data) allGrades = devGrades.data;
        if (devStudentExams && devStudentExams.data) allStudentExams = devStudentExams.data;
        console.debug('dev responses', { assign: allAssignGrades.length, grades: allGrades.length, studentExams: allStudentExams.length });
      } catch (e) {
        console.warn('dev endpoints fetch failed', e?.message || e);
      }

      // If dev endpoints returned partial data (e.g. only student-exams), fetch missing resources from the protected endpoints individually.
      // This prevents one non-empty dev response from short-circuiting other needed protected fetches.
      try {
        if (allAssignGrades.length === 0) {
          try {
            const assignRes = await axios.get(`${base}/api/queries/assignment-grade/teacher`, { headers: { Authorization: `Bearer ${token}` } });
            if (assignRes && assignRes.data) allAssignGrades = assignRes.data;
            console.debug('protected assignment-grade fetched', { assign: allAssignGrades.length });
          } catch (e) {
            console.warn('assignment-grade protected fetch failed', e?.response?.data || e.message || e);
          }
        }
        if (allGrades.length === 0) {
          try {
            const gradeRes = await axios.get(`${base}/api/queries/grade`, { headers: { Authorization: `Bearer ${token}` } });
            if (gradeRes && gradeRes.data) allGrades = gradeRes.data;
            console.debug('protected grade fetched', { grades: allGrades.length });
          } catch (e) {
            console.warn('grade protected fetch failed', e?.response?.data || e.message || e);
          }
        }
        if (allStudentExams.length === 0) {
          try {
            const studentExamRes = await axios.get(`${base}/api/queries/student-exam`, { headers: { Authorization: `Bearer ${token}` } });
            if (studentExamRes && studentExamRes.data) allStudentExams = studentExamRes.data;
            console.debug('protected student-exam fetched', { studentExams: allStudentExams.length });
          } catch (e) {
            console.warn('student-exam protected fetch failed', e?.response?.data || e.message || e);
          }
        }
      } catch (e) {
        console.warn('partial protected fetches encountered an error', e?.message || e);
      }

      // store raw student-exam read-models (dev endpoints sometimes omit nested courseId on exam)
      // we'll keep the full list and only map entries that actually belong to this course when building examScoreMap below
      const rawStudentExams = allStudentExams || [];
      setStudentExamsForCourse(rawStudentExams);
      console.debug('studentExams fetched', { count: rawStudentExams.length, sample: rawStudentExams.slice(0,5) });

      // fetch assignments and exams read-models early so we can build students rows with proper columns
      let examsList = exams;
      let assignmentsList = assignmentsForCourseFlat || [];
      try {
        const [assignmentsResLocal, examsResLocal] = await Promise.all([
          axios.get(`${base}/api/queries/assignments`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${base}/api/queries/exams/course/${courseId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const assignmentsAll = assignmentsResLocal.data || [];
        assignmentsList = assignmentsAll.filter(a => String(a.courseId) === String(courseId));
        examsList = examsResLocal.data || [];
        // update local state
        setAssignmentsForCourseFlat(assignmentsList);
        setExams(examsList);
      } catch (e) {
        console.warn('Failed to fetch assignments/exams inside fetchGrades, falling back to state', e?.response?.data || e.message);
      }

      // assignment-grade read-models don't have a top-level courseId; the course is on the populated assignmentId
      const filteredAssign = allAssignGrades.filter(g => {
        const aCourseId = g.assignmentId?.courseId || g.assignmentId?._id || g.courseId || g.assignment?.courseId || g.courseId?._id;
        return String(aCourseId) === String(courseId);
      });

      // grade read-models have courseId as a populated object (courseId.courseId) or as an id
      const filteredGrades = allGrades.filter(g => {
        const gcourse = g.courseId?.courseId || g.courseId?._id || g.courseId || g.course?.courseId || g.course;
        return String(gcourse) === String(courseId);
      });
      setAssignmentGradesForCourse(filteredAssign);
      setCourseGradesForCourse(filteredGrades);

  // debug: log filteredGrades entries that include examId (these are exam-level grades)
  const examLevelGrades = filteredGrades.filter(g => (g.examId || g.exam));
  console.debug('filteredGrades exam-level entries', { count: examLevelGrades.length, sample: examLevelGrades.slice(0,5) });

  // build students map
      const studentsMap = {};
      const addStudentFrom = (s) => {
        if (!s) return;
        // accept either a populated student doc { studentId, name } or a flat object { id, name }
        const key = s.studentId || s._id || s.id;
        if (!key) return;
        const name = s.name || (s.student && s.student.name) || (s.studentId && s.studentId.name) || '';
        const email = s.email || (s.student && s.student.email) || (s.studentId && s.studentId.email) || '';
        studentsMap[key] = { _id: s._id || key, id: key, studentId: s.studentId || key, name, email };
      };
      filteredAssign.forEach(g => addStudentFrom(g.studentId || g.student));
      filteredGrades.forEach(g => addStudentFrom(g.studentId || g.student));

      // ensure we also include students who are enrolled but may not have grades yet (best-effort endpoint)
      let studentsEndpointCount = 0;
      let studentsListCount = 0;
      setStudentsFetchError(null);
      try {
        try {
          const studentsRes = await axios.get(`${base}/api/queries/student-courses/course/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
          const enrolled = studentsRes.data || [];
          studentsEndpointCount = enrolled.length;
          console.debug('student-courses/course response', { status: studentsRes.status, dataSample: enrolled.slice(0,10) });
          if (enrolled.length > 0) {
            enrolled.forEach(s => addStudentFrom(s.student || s));
          } else {
            // fallback: get all student-course entries and filter by courseId
            const listRes = await axios.get(`${base}/api/queries/student-courses`, { headers: { Authorization: `Bearer ${token}` } });
            const entries = listRes.data || [];
            studentsListCount = entries.length;
            console.debug('student-courses list response', { status: listRes.status, length: entries.length, sample: entries.slice(0,10) });
            entries.filter(e => String(e.courseId?._id || e.courseId) === String(courseId)).forEach(e => addStudentFrom(e.studentId || e.student));
          }
          // if still no students, try SQL fallback endpoint
          if (Object.keys(studentsMap).length === 0) {
            try {
              const sqlRes = await axios.get(`${base}/api/queries/student-courses/sql/course/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
              const sqlStudents = sqlRes.data || [];
              console.debug('student-courses/sql/course response', { status: sqlRes.status, sample: sqlStudents.slice(0,10) });
              sqlStudents.forEach(s => addStudentFrom({ _id: s.id, studentId: s.id, name: s.name, email: s.email }));
            } catch (sqlErr) {
              console.warn('SQL students fallback failed', sqlErr?.response?.data || sqlErr.message);
              setStudentsFetchError(prev => prev ? prev + ' | sql fallback error: ' + (sqlErr?.response?.data || sqlErr.message) : `sql fallback error: ${sqlErr?.response?.data || sqlErr.message}`);
            }
          }
        } catch (innerErr) {
          // axios throws for non-2xx; capture status/data for debugging
          const status = innerErr?.response?.status;
          const data = innerErr?.response?.data;
          console.warn('Could not fetch enrolled students (course endpoint)', { status, data, message: innerErr.message });
          setStudentsFetchError(`student-courses/course error: ${status || ''} ${data && typeof data === 'object' ? JSON.stringify(data) : data || innerErr.message}`);
          // attempt list fallback
          try {
            const listRes = await axios.get(`${base}/api/queries/student-courses`, { headers: { Authorization: `Bearer ${token}` } });
            const entries = listRes.data || [];
            studentsListCount = entries.length;
            console.debug('student-courses list response (fallback)', { status: listRes.status, length: entries.length, sample: entries.slice(0,10) });
            entries.filter(e => String(e.courseId?._id || e.courseId) === String(courseId)).forEach(e => addStudentFrom(e.studentId || e.student));
          } catch (listErr) {
            const lstatus = listErr?.response?.status;
            const ldata = listErr?.response?.data;
            console.warn('Could not fetch student-courses list fallback', { status: lstatus, data: ldata, message: listErr.message });
            setStudentsFetchError(prev => prev ? prev + ' | list fallback error: ' + (ldata || listErr.message) : `list fallback error: ${ldata || listErr.message}`);
          }
        }
      } catch (err) {
        console.warn('Unexpected error fetching enrolled students', err?.response?.data || err.message);
        setStudentsFetchError(err?.response?.data || err.message || 'unknown error');
      }
      // attach course, assignment and exam existing scores to student objects for quick display in the table
      const courseScoreMap = {};
      const assignmentScoreMap = {}; // { sid: { aid: score } }
  // examScoreMap will keep the newest student-exam per student+exam using the Mongo _id timestamp
  // shape: { sid: { eid: { score, _idHex } } }
  const examScoreMap = {}; // { sid: { eid: { score, _idHex } } }

      filteredGrades.forEach(g => {
        const sidRaw = g.studentId?.studentId || g.studentId?._id || g.studentId || (g.student && (g.student.studentId || g.student.id || g.student._id));
        if (!sidRaw) return;
        const sid = String(sidRaw);
        courseScoreMap[sid] = g.score != null ? g.score : undefined;
        if (!examScoreMap[sid]) examScoreMap[sid] = {};
        // support both numeric examId on populated exam and Mongo _id. Keep newest by ObjectId timestamp
        const examDoc = g.examId || g.exam;
        const eidNumeric = examDoc?.examId;
        const eidMongo = examDoc?._id;
        const scoreVal = g.score != null ? g.score : undefined;
        const incomingIdHex = (g._id || examDoc?._id) ? String(g._id || examDoc?._id) : null;
        const upsert = (key) => {
          const existing = examScoreMap[sid][key];
          if (!existing) {
            examScoreMap[sid][key] = { score: scoreVal, _idHex: incomingIdHex };
          } else {
            try {
              // compare ObjectId timestamp via first 8 hex chars
              const existingTs = existing._idHex ? parseInt(String(existing._idHex).slice(0,8), 16) : 0;
              const incomingTs = incomingIdHex ? parseInt(String(incomingIdHex).slice(0,8), 16) : 0;
              if (incomingTs >= existingTs) examScoreMap[sid][key] = { score: scoreVal, _idHex: incomingIdHex };
            } catch (e) {
              // fallback: overwrite
              examScoreMap[sid][key] = { score: scoreVal, _idHex: incomingIdHex };
            }
          }
        };
        if (eidNumeric != null) upsert(String(eidNumeric));
        if (eidMongo != null) upsert(String(eidMongo));
      });

      // student-exam read-models (explicit exam grades per student)
      // Dev read-models sometimes omit exam.courseId, so we match by the exam's numeric examId or _id against the exams list for this course
      (allStudentExams || []).forEach(se => {
        const sidRaw = se.studentId?.studentId || se.studentId?._id || se.studentId || (se.student && (se.student.studentId || se.student.id || se.student._id));
        const examDoc = se.examId || se.exam;
        const eidNumeric = examDoc?.examId;
        const eidMongo = examDoc?._id;
        if (!sidRaw || (eidNumeric == null && eidMongo == null)) return;
        // determine whether this student-exam belongs to this course by checking the exams list (if available)
        let belongsToCourse = false;
        try {
          if (examDoc?.courseId && String(examDoc.courseId) === String(courseId)) belongsToCourse = true;
          if (!belongsToCourse && Array.isArray(examsList) && examsList.length > 0) {
            if (eidNumeric != null && examsList.some(x => String(x.examId) === String(eidNumeric))) belongsToCourse = true;
            if (!belongsToCourse && eidMongo != null && examsList.some(x => String(x._id) === String(eidMongo) || String(x.examId) === String(eidMongo))) belongsToCourse = true;
          }
          // if examsList is empty (fetch failed), be permissive and include the entry; the UI will only render exams that are in the exams array
          if (!belongsToCourse && (!examsList || examsList.length === 0)) belongsToCourse = true;
        } catch (e) {
          // defensive: if matching logic throws, skip this entry
          console.debug('studentExam matching error', e?.message || e);
          return;
        }
        if (!belongsToCourse) return;
        const sid = String(sidRaw);
        if (!examScoreMap[sid]) examScoreMap[sid] = {};
        const scoreVal = se.score != null ? se.score : undefined;
        const incomingIdHex = se._id ? String(se._id) : null;
        const upsertSe = (key) => {
          const existing = examScoreMap[sid][key];
          if (!existing) {
            examScoreMap[sid][key] = { score: scoreVal, _idHex: incomingIdHex };
          } else {
            try {
              const existingTs = existing._idHex ? parseInt(String(existing._idHex).slice(0,8), 16) : 0;
              const incomingTs = incomingIdHex ? parseInt(String(incomingIdHex).slice(0,8), 16) : 0;
              if (incomingTs >= existingTs) examScoreMap[sid][key] = { score: scoreVal, _idHex: incomingIdHex };
            } catch (e) {
              examScoreMap[sid][key] = { score: scoreVal, _idHex: incomingIdHex };
            }
          }
        };
        if (eidNumeric != null) upsertSe(String(eidNumeric));
        if (eidMongo != null) upsertSe(String(eidMongo));
      });

      // debug examScoreMap contents (sizes, some keys)
      try {
        const examScoreSample = {};
        Object.keys(examScoreMap).slice(0,5).forEach(sid => { examScoreSample[sid] = Object.keys(examScoreMap[sid] || {}).slice(0,5); });
        console.debug('examScoreMap summary', { studentsWithExamScores: Object.keys(examScoreMap).length, sample: examScoreSample });
      } catch (e) {
        console.debug('examScoreMap debug failed', e?.message || e);
      }

      filteredAssign.forEach(g => {
        const sidRaw = g.studentId?.studentId || g.studentId?._id || g.studentId || (g.student && (g.student.studentId || g.student.id || g.student._id));
        if (!sidRaw) return;
        const sid = String(sidRaw);
        if (!assignmentScoreMap[sid]) assignmentScoreMap[sid] = {};
        const assignDoc = g.assignmentId || g.assignment;
        const aidNumeric = assignDoc?.assignmentId;
        const aidMongo = assignDoc?._id;
        const scoreVal = g.score != null ? g.score : undefined;
        if (aidNumeric != null) assignmentScoreMap[sid][String(aidNumeric)] = scoreVal;
        if (aidMongo != null) assignmentScoreMap[sid][String(aidMongo)] = scoreVal;
      });

      // Build students array and attach compact assignment/exam lists
      const studentsArray = Object.values(studentsMap).map(s => {
        const sidRaw = s.studentId ?? s._id ?? s.id;
        const sid = String(sidRaw);
        const assignScoresArr = (assignmentsList || assignmentsForCourseFlat || []).map(a => {
          const aidRaw = a.assignmentId || a._id || a.id;
          const aid = aidRaw != null ? String(aidRaw) : aidRaw;
          const score = assignmentScoreMap[sid] ? assignmentScoreMap[sid][aid] : undefined;
          return { assignmentId: aidRaw, title: a.title || `A ${aidRaw}`, score };
        });
        const assignmentScores = {};
        assignScoresArr.forEach(a => { const key = a.assignmentId != null ? String(a.assignmentId) : a.assignmentId; assignmentScores[key] = a.score; });

        const examScoresArr = (examsList || exams || []).map(ex => {
          const eidRaw = ex.examId || ex._id || ex.id;
          const eid = eidRaw != null ? String(eidRaw) : eidRaw;
            // prefer the deduped score entry from examScoreMap
            let scoreEntry = examScoreMap[sid] ? examScoreMap[sid][eid] : undefined;
            let score = undefined;
            if (scoreEntry && typeof scoreEntry === 'object') score = scoreEntry.score;
            else score = scoreEntry;
            // additionally, check the raw studentExams list and pick the newest matching doc by ObjectId timestamp
            if (Array.isArray(studentExamsForCourse)) {
              try {
                const matches = studentExamsForCourse.filter(se => {
                  const seSid = se.studentId?.studentId || se.studentId?._id || se.studentId || (se.student && (se.student.studentId || se.student.id || se.student._id));
                  const examDoc = se.examId || se.exam;
                  const seEidNumeric = examDoc?.examId;
                  const seEidMongo = examDoc?._id;
                  const matchSid = String(seSid) === String(sid);
                  const matchEid = (seEidNumeric != null && String(seEidNumeric) === String(eidRaw)) || (seEidMongo != null && String(seEidMongo) === String(eidRaw));
                  return matchSid && matchEid;
                });
                if (matches.length > 0) {
                  // pick the doc with the newest ObjectId timestamp (highest first 8 hex chars)
                  const best = matches.reduce((bestSoFar, cur) => {
                    const curId = cur._id ? String(cur._id) : null;
                    const bestId = bestSoFar && bestSoFar._id ? String(bestSoFar._id) : null;
                    const curTs = curId ? parseInt(curId.slice(0,8), 16) : 0;
                    const bestTs = bestId ? parseInt(bestId.slice(0,8), 16) : 0;
                    return curTs >= bestTs ? cur : bestSoFar;
                  }, null);
                  const latestScore = best && best.score != null ? best.score : undefined;
                  // if latestScore exists and differs from current score, use it
                  if (latestScore !== undefined && latestScore !== score) {
                    score = latestScore;
                  }
                }
              } catch (e) {
                console.debug('studentExams fallback failed', e?.message || e);
              }
            }
          return { examId: eidRaw, title: ex.title || `E ${eidRaw}`, score };
        });
        const examScores = {};
        examScoresArr.forEach(e => { const key = e.examId != null ? String(e.examId) : e.examId; examScores[key] = e.score; });

        return { ...s, courseScore: courseScoreMap[sid] ?? s.courseScore, assignments: assignScoresArr, exams: examScoresArr, assignmentScores, examScores };
      });
      setStudentsForCourse(studentsArray);
  console.debug('studentsForCourse built', { length: studentsArray.length, studentsEndpointCount, studentsListCount });
  if (studentsArray && studentsArray.length > 0) {
    const first = studentsArray[0];
    console.debug('first student score maps', {
      id: first.studentId || first._id || first.id,
      assignmentScores: first.assignmentScores,
      examScores: first.examScores,
      assignmentScoreKeys: Object.keys(first.assignmentScores || {}).slice(0,20),
      examScoreKeys: Object.keys(first.examScores || {}).slice(0,20),
      sampleAssignments: first.assignments && first.assignments.slice(0,5),
      sampleExams: first.exams && first.exams.slice(0,5),
    });
  }

      // prefill matrixEditing using the same keys the dialogs expect:
      // assignments -> `${sid}:${aid}` and exams -> `ex:${sid}:${eid}`. Also include course-level key `course:${sid}` for reference.
      const editMap = {};
      filteredAssign.forEach(g => {
        const aid = g.assignmentId?.assignmentId || g.assignmentId?._id || g.assignmentId || g.assignment;
        const sid = g.studentId?.studentId || g.studentId?._id || g.studentId || (g.student && (g.student.studentId || g.student.id || g.student._id));
        if (!sid || !aid) return;
        const key = `${sid}:${aid}`;
        editMap[key] = g.score != null ? g.score : '';
      });
      filteredGrades.forEach(g => {
        const sid = g.studentId?.studentId || g.studentId?._id || g.studentId || (g.student && (g.student.studentId || g.student.id || g.student._id));
        if (!sid) return;
        const eid = g.examId?.examId || g.examId?._id || g.examId || g.exam;
        if (eid) {
          const key = `ex:${sid}:${eid}`;
          editMap[key] = g.score != null ? g.score : '';
        } else {
          const key = `course:${sid}`;
          editMap[key] = g.score != null ? g.score : '';
        }
      });
      // include student-exam read-model entries into the edit map so the single-student dialog pre-fills exam scores
      try {
        (rawStudentExams || []).forEach(se => {
          const sid = se.studentId?.studentId || se.studentId?._id || se.studentId || (se.student && (se.student.studentId || se.student.id || se.student._id));
          const examDoc = se.examId || se.exam;
          const eid = examDoc?.examId || examDoc?._id || examDoc;
          if (!sid || !eid) return;
          // only include if it appears to belong to this course (match against examsList if available)
          let belongs = false;
          if (examDoc?.courseId && String(examDoc.courseId) === String(courseId)) belongs = true;
          if (!belongs && Array.isArray(examsList) && examsList.length > 0) {
            if (examsList.some(x => String(x.examId) === String(eid) || String(x._id) === String(eid))) belongs = true;
          }
          if (!belongs && (!examsList || examsList.length === 0)) belongs = true;
          if (!belongs) return;
          const key = `ex:${sid}:${eid}`;
          editMap[key] = se.score != null ? se.score : '';
        });
      } catch (e) {
        console.debug('could not merge student-exams into edit map', e?.message || e);
      }
      setMatrixEditing(editMap);

      // build assignment and exam points maps by fetching assignments/exams read-models
      try {
        const [assignmentsRes, examsRes] = await Promise.all([
          axios.get(`${base}/api/queries/assignments`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${base}/api/queries/exams/course/${courseId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const assignments = (assignmentsRes.data || []).filter(a => String(a.courseId) === String(courseId));
        const exams = examsRes.data || [];
        // ensure frontend has the assignments flat list available (in case fetchData hasn't completed yet)
        if (!assignmentsForCourseFlat || assignmentsForCourseFlat.length === 0) {
          setAssignmentsForCourseFlat(assignments);
        }
        setExams(exams);
        const pts = {};
        assignments.forEach(a => { const aid = a.assignmentId || a._id || a.id; pts[aid] = a.points != null ? a.points : undefined; });
        const epts = {};
        exams.forEach(ex => { const eid = ex.examId || ex._id || ex.id; epts[eid] = ex.points != null ? ex.points : undefined; });
        setAssignmentPoints(pts);
        setExamPoints(epts);
      } catch (e) {
        console.warn('Failed to fetch assignment/exam points', e);
        setAssignmentPoints({});
        setExamPoints({});
      }

    } catch (err) {
      console.error('Failed to fetch grades', err?.response?.data || err.message);
    }
  };

  const saveAssignmentGrade = async (studentId, assignmentId, currentScore) => {
    const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
    const token = localStorage.getItem('accessToken');
    if (currentScore === '') return alert('Score required');
    const score = Number(currentScore);
    if (isNaN(score) || score < 0) return alert('Score must be >= 0');
    const maxPoints = assignmentPoints[assignmentId] || assignmentPoints[assignmentId?.toString()];
    if (maxPoints != null && !isNaN(maxPoints) && score > Number(maxPoints)) return alert(`Score cannot exceed assignment max points (${maxPoints})`);
    try {
      const exists = assignmentGradesForCourse.some(g => {
        const sid = g.studentId?.studentId || g.studentId?._id || g.studentId;
        const aid = g.assignmentId?.assignmentId || g.assignmentId?._id || g.assignmentId;
        return String(sid) === String(studentId) && String(aid) === String(assignmentId);
      });
      if (exists) {
        await axios.put(`${base}/api/commands/assignment-grade`, { studentId, assignmentId, score }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${base}/api/commands/assignment-grade`, { studentId, assignmentId, score }, { headers: { Authorization: `Bearer ${token}` } });
      }
      // optimistic update: patch local structures so UI reflects the new value immediately
      setAssignmentGradesForCourse(prev => {
        const copy = Array.isArray(prev) ? [...prev] : [];
        const foundIdx = copy.findIndex(g => String(g.studentId?.studentId || g.studentId?._id || g.studentId) === String(studentId) && String(g.assignmentId?.assignmentId || g.assignmentId?._id || g.assignmentId) === String(assignmentId));
        if (foundIdx >= 0) {
          copy[foundIdx] = { ...copy[foundIdx], score };
        } else {
          copy.push({ studentId: { studentId: studentId }, assignmentId: { assignmentId: assignmentId }, score });
        }
        return copy;
      });
      setStudentsForCourse(prev => {
        return prev.map(s => {
          const sid = s.studentId || s._id || s.id;
          if (String(sid) !== String(studentId)) return s;
          const key = assignmentId != null ? String(assignmentId) : assignmentId;
          const assignmentScores = { ...(s.assignmentScores || {}) };
          assignmentScores[key] = score;
          return { ...s, assignmentScores };
        });
      });
      alert('Assignment grade saved');
      // refresh in background
      fetchGrades();
    } catch (err) {
      console.error('Save failed', err?.response?.data || err.message);
      const msg = err?.response?.data?.error || (typeof err?.response?.data === 'string' ? err.response.data : null) || err.message || 'Failed to save assignment grade';
      alert(msg);
    }
  };

  const saveCourseGrade = async (studentId, courseIdLocal, currentScore, examId = null) => {
    const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
    const token = localStorage.getItem('accessToken');
    if (currentScore === '') return alert('Score required');
    const score = Number(currentScore);
    if (isNaN(score) || score < 0 || score > 100) return alert('Score must be 0-100');
    try {
        if (examId) {
          // exam-specific grade: check existing student-exam read-model entry and use PUT to update via command route
          const existing = studentExamsForCourse.find(se => {
            const sid = se.studentId?.studentId || se.studentId?._id || se.studentId || (se.student && (se.student.studentId || se.student.id || se.student._id));
            const eid = se.examId?.examId || se.examId?._id || se.examId || (se.exam && (se.exam.examId || se.exam.id));
            return String(sid) === String(studentId) && String(eid) === String(examId);
          });
          if (existing) {
            await axios.put(`${base}/api/commands/student-exam`, { studentId, examId, score }, { headers: { Authorization: `Bearer ${token}` } });
          } else {
            await axios.post(`${base}/api/commands/student-exam`, { studentId, examId, score }, { headers: { Authorization: `Bearer ${token}` } });
          }
          // optimistic update: patch local studentsForCourse examScores and studentExamsForCourse
          setStudentExamsForCourse(prev => {
            const copy = Array.isArray(prev) ? [...prev] : [];
            // find existing by student+exam
            const idx = copy.findIndex(se => (String(se.studentId?.studentId || se.studentId?._id || se.studentId) === String(studentId)) && (String(se.examId?.examId || se.examId?._id || se.examId) === String(examId)));
            if (idx >= 0) {
              copy[idx] = { ...copy[idx], score };
            } else {
              copy.push({ studentId: { studentId }, examId: { examId: examId }, score });
            }
            return copy;
          });
          setStudentsForCourse(prev => prev.map(s => {
            const sid = s.studentId || s._id || s.id;
            if (String(sid) !== String(studentId)) return s;
            const examScores = { ...(s.examScores || {}) };
            examScores[String(examId)] = score;
            return { ...s, examScores };
          }));
        } else {
          const exists = courseGradesForCourse.some(g => {
            const sid = g.studentId?.studentId || g.studentId?._id || g.studentId;
            const cid = g.courseId?.courseId || g.courseId?._id || g.courseId;
            return String(sid) === String(studentId) && String(cid) === String(courseIdLocal);
          });
          if (exists) {
            await axios.put(`${base}/api/commands/grade`, { studentId, courseId: courseIdLocal, score }, { headers: { Authorization: `Bearer ${token}` } });
          } else {
            await axios.post(`${base}/api/commands/grade`, { studentId, courseId: courseIdLocal, score }, { headers: { Authorization: `Bearer ${token}` } });
          }
          // optimistic update for course-level grade
          setCourseGradesForCourse(prev => {
            const copy = Array.isArray(prev) ? [...prev] : [];
            const idx = copy.findIndex(g => String(g.studentId?.studentId || g.studentId?._id || g.studentId) === String(studentId) && String(g.courseId?.courseId || g.courseId?._id || g.courseId) === String(courseIdLocal));
            if (idx >= 0) copy[idx] = { ...copy[idx], score };
            else copy.push({ studentId: { studentId }, courseId: { courseId: courseIdLocal }, score });
            return copy;
          });
          setStudentsForCourse(prev => prev.map(s => ({ ...(s), courseScore: String(s.studentId || s._id || s.id) === String(studentId) ? score : s.courseScore })));
        }
      await fetchGrades();
      alert('Course/Exam grade saved');
    } catch (err) {
      console.error('Save failed', err?.response?.data || err.message);
      const msg = err?.response?.data?.error || (typeof err?.response?.data === 'string' ? err.response.data : null) || err.message || 'Failed to save course grade';
      alert(msg);
    }
  };

  // Download helper
  const handleDownload = async (uploadId, filename) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return alert('You must be logged in to download files.');
      const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
      const url = `${base}/api/queries/uploads/${uploadId}/download`;
      const res = await axios.get(url, { responseType: 'blob', headers: { Authorization: `Bearer ${token}` } });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed', err.response?.data || err.message);
      alert('Download failed.');
    }
  };

  const handleDeleteUpload = async (uploadId) => {
    if (!window.confirm('Delete this file?')) return;
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return alert('You must be logged in');
      const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
      await axios.delete(`${base}/api/commands/upload/${uploadId}`, { headers: { Authorization: `Bearer ${token}` } });
      await fetchData();
    } catch (err) {
      console.error('Delete failed', err.response?.data || err.message);
      alert('Delete failed');
    }
  };
  const handleSelectFile = (type, id, file) => {
    setSelectedFiles((prev) => ({ ...prev, [`${type}-${id}`]: file }));
  };

  const handleUpload = async (type, id) => {
    if (!id) return alert("Invalid ID. Please save the lecture/assignment first.");
    const key = `${type}-${id}`;
    const file = selectedFiles[key];
    if (!file) return alert("Choose a file first.");

    const fd = new FormData();
    // append non-file fields first so multer can detect them when processing the file
    // Rules:
    // - Assignments: both students and teachers may upload. If a student uploads, include studentId.
    // - Lectures: teachers only (UI prevents students) but keep behavior consistent.
    // - Exams: ONLY teachers may upload. Block student attempts here as well.
    if (type === "assignment") {
      fd.append("assignmentId", id);
      if (currentRole === 'student') {
        if (!studentId) return alert("Not logged in.");
        fd.append("studentId", studentId);
      }
    } else if (type === "lecture") {
      fd.append("lectureId", id);
    } else if (type === "exam") {
      // Prevent students from uploading to exams
      if (currentRole === 'student') {
        return alert('Students are not allowed to upload exam files.');
      }
      fd.append("examId", id);
    }
    fd.append("file", file);

    try {
      setUploading((prev) => ({ ...prev, [key]: true }));
      // let axios set Content-Type (with proper multipart boundary)
      // ensure authorization header is explicitly included (some CORS setups strip headers on multipart preflight)
      const token = localStorage.getItem('accessToken');
      if (!token) return alert('You must be logged in to upload files.');
      const base = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
      await axios.post(`${base}/api/commands/upload`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Upload successful!");
      // refetch course data so new uploads appear immediately
      await fetchData();
    } catch (err) {
      console.error('Upload failed', err.response?.data || err.message);
      alert("Upload failed.");
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };



  useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // fetch grades when course data loads
  useEffect(() => {
    fetchGrades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // debug: log role and studentView to help diagnose UI visibility
  useEffect(() => {
    console.debug('CourseLayout mounted/updated', { courseId, studentView, currentRole, studentId });
  }, [courseId, studentView, currentRole, studentId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  // Lecture/Assignment/Exam handlers (unchanged)
  const handleLectureSave = async () => { setOpenLectureModal(false); setEditingLecture(null); await fetchData(); };
  const handleLectureDelete = async (id) => { if (!window.confirm("Delete this lecture?")) return; await axios.delete(`http://localhost:5000/api/commands/lectures/${id}`); await fetchData(); };
  const handleAssignmentSave = async () => { setOpenAssignmentModal(false); setEditingAssignment(null); await fetchData(); };
  const handleAssignmentDelete = async (id) => { if (!window.confirm("Delete this assignment?")) return; await axios.delete(`http://localhost:5000/api/commands/assignments/${id}`); await fetchData(); };
  const handleExamSave = async () => { setOpenExamModal(false); setEditingExam(null); await fetchData(); };
  const handleExamDelete = async (id) => { if (!window.confirm("Delete this exam?")) return; await axios.delete(`http://localhost:5000/api/commands/exams/${id}`); await fetchData(); };

  return (
      <Box sx={{ display: "flex", height: "100%", gap: 2 }}>
        {/* Lectures & Assignments */}
        <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
          {lectures.map((lec) => (
            <Box key={lec.lectureId} sx={{ mb: 4 }}>
              <Box sx={{ border: "1px solid #ddd", backgroundColor: "white", borderRadius: 1, p: 2 }}>
                {/* Header: show simple title row for teacher, full content expands on click */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">{lec.title}</Typography>
                  <Box>
                    {compactMode ? (
                      <>
                        <Button size="small" onClick={() => setOpenLectureId(openLectureId === lec.lectureId ? null : lec.lectureId)} sx={{ mr: 1 }}>
                          {openLectureId === lec.lectureId ? 'Hide' : 'View'}
                        </Button>
                        {/* In compactMode teachers still get edit/delete controls */}
                        {currentRole === 'teacher' && !studentView && (
                          <>
                            <Button size="small" onClick={() => { setEditingLecture(lec); setOpenLectureModal(true); }} sx={{ mr: 1 }}>Edit</Button>
                            <Button size="small" color="error" onClick={() => handleLectureDelete(lec.lectureId)}>Delete</Button>
                          </>
                        )}
                      </>
                    ) : (
                      null
                    )}
                  </Box>
                </Box>

                {/* Only show full lecture details when not in compact teacher mode, or when expanded */}
                {(!compactMode || openLectureId === lec.lectureId) && (
                  <>
                    {/* Edit/Delete Lecture (for non-teacher flows) */}
                    {!studentView && currentRole !== 'teacher' && (
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Button size="small" onClick={() => { setEditingLecture(lec); setOpenLectureModal(true); }}>Edit</Button>
                        <Button size="small" color="error" onClick={() => handleLectureDelete(lec.lectureId)}>Delete</Button>
                      </Box>
                    )}

                    {/* Lecture Uploads */}
                    {lec.uploads?.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle2">Lecture Files:</Typography>
                        {lec.uploads.map((u) =>
                          u.file ? (
                            <Link
                              key={u.id}
                              component="button"
                              onClick={() => handleDownload(u.id, u.file)}
                              underline="hover"
                            >
                              {u.file} {u.timeUploaded && `(${new Date(u.timeUploaded).toLocaleString()})`}
                            </Link>
                          ) : null
                        )}
                      </Box>
                    )}

                    {/* Upload lecture file (teachers only) */}
                    {!studentView && (
                      <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center", flexWrap: "wrap" }}>
                        <Button variant="outlined" size="small" component="label">
                          Choose file
                          <input type="file" hidden onChange={(e) => handleSelectFile("lecture", lec.lectureId, e.target.files?.[0])} />
                        </Button>
                        <Typography variant="caption">{selectedFiles[`lecture-${lec.lectureId}`]?.name || "No file chosen"}</Typography>
                        <Button variant="contained" size="small" disabled={!!uploading[`lecture-${lec.lectureId}`]} onClick={() => handleUpload("lecture", lec.lectureId)}>
                          {uploading[`lecture-${lec.lectureId}`] ? "Uploading..." : "Upload"}
                        </Button>
                      </Box>
                    )}

                    {/* Assignments: show compact list; each can expand for details */}
                    {lec.assignments.map((a) => {
                      const due = a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "—";
                      return (
                        <Box key={a.assignmentId} sx={{ border: "1px solid #ccc", borderRadius: 1, p: 1, mt: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography>{a.title}</Typography>
                              <Typography variant="caption" color="textSecondary">Due: {due}</Typography>
                            </Box>
                            <Box>
                              {compactMode ? (
                                <>
                                  <Button size="small" onClick={() => setOpenAssignmentId(openAssignmentId === a.assignmentId ? null : a.assignmentId)} sx={{ mr: 1 }}>
                                    {openAssignmentId === a.assignmentId ? 'Hide' : 'View'}
                                  </Button>
                                  {currentRole === 'teacher' && !studentView && (
                                    <>
                                      <Button size="small" onClick={() => { setCurrentLectureId(lec.lectureId); setEditingAssignment(a); setOpenAssignmentModal(true); }} sx={{ mr: 1 }}>Edit</Button>
                                      <Button size="small" color="error" onClick={() => handleAssignmentDelete(a.assignmentId)}>Delete</Button>
                                    </>
                                  )}
                                </>
                              ) : null}
                            </Box>
                          </Box>

                          {/* Assignment details when expanded or in non-teacher view */}
                          {(!compactMode || openAssignmentId === a.assignmentId) && (
                            <>
                              {/* Assignment Uploads */}
                              {a.uploads?.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="subtitle2">Submitted Files:</Typography>
                                  {a.uploads.map((u) =>
                                    u.file ? (
                                      <Link
                                        key={u.id}
                                        component="button"
                                        onClick={() => handleDownload(u.id, u.file)}
                                        underline="hover"
                                      >
                                        {u.file} {u.timeUploaded && `(${new Date(u.timeUploaded).toLocaleString()})`}
                                        {u.student && `  — ${u.student.name}`}
                                      </Link>
                                    ) : null
                                  )}
                                </Box>
                              )}

                              {/* Student upload: prominent single-button upload on each assignment */}
                              {(studentView || currentRole === 'student' || (!studentView && currentRole === 'teacher')) && (
                                <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center", flexWrap: "wrap" }}>
                                  <input
                                    id={`assignment-file-${a.assignmentId}`}
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      handleSelectFile("assignment", a.assignmentId, file);
                                    }}
                                  />
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => document.getElementById(`assignment-file-${a.assignmentId}`).click()}
                                  >
                                    Choose file
                                  </Button>
                                  <Typography variant="caption">{selectedFiles[`assignment-${a.assignmentId}`]?.name || "No file chosen"}</Typography>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    disabled={!selectedFiles[`assignment-${a.assignmentId}`] || !!uploading[`assignment-${a.assignmentId}`]}
                                    onClick={() => handleUpload("assignment", a.assignmentId)}
                                  >
                                    {uploading[`assignment-${a.assignmentId}`] ? "Uploading..." : "Upload"}
                                  </Button>
                                </Box>
                              )}

                              {/* Grade button visible to teachers/admins on each assignment */}
                              {currentRole === 'teacher' && !studentView && (
                                <Box sx={{ mt: 1 }}>
                                  <Button size="small" variant="outlined" onClick={() => {
                                    // prepare map of existing scores for this assignment
                                    const aid = a.assignmentId || a._id || a.id;
                                    const map = {};
                                    studentsForCourse.forEach(s => {
                                      const sid = s.studentId || s._id || s.id;
                                      const existing = assignmentGradesForCourse.find(g => ((g.assignmentId?.assignmentId || g.assignmentId?._id || g.assignmentId) === aid) && ((g.studentId?.studentId || g.studentId?._id || g.studentId) === sid));
                                      map[sid] = existing ? (existing.score != null ? existing.score : '') : '';
                                    });
                                    setAssignmentAllEditing(map);
                                    setAssignmentToGradeAll(a);
                                    setAssignmentAllGraderOpen(true);
                                  }}>Grade</Button>
                                </Box>
                              )}
                            </>
                          )}
                        </Box>
                      );
                    })}

                    {/* Add Assignment */}
                    {!studentView && (
                      <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={() => { setCurrentLectureId(lec.lectureId); setEditingAssignment(null); setOpenAssignmentModal(true); }}>
                        Add Assignment
                      </Button>
                    )}
                  </>
                )}
              </Box>
            </Box>
          ))}

          {/* Add Lecture */}
          {!studentView && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingLecture(null); setOpenLectureModal(true); }}>
              Add Lecture
            </Button>
          )}
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* Exams */}
        <Box sx={{ flex: 1, p: 3, overflowY: "auto" }}>
          <Typography variant="h5" gutterBottom>Exams</Typography>
          {exams.map((e) => (
            <Box key={e.examId} sx={{ border: "1px solid #ddd", backgroundColor: "white", borderRadius: 1, p: 2, mb: 2 }}>
              <Typography>{e.title}</Typography>
              <Typography variant="caption" color="textSecondary">Date: {e.date ? new Date(e.date).toLocaleDateString() : "—"}</Typography>

              {/* Exam Uploads */}
              {e.uploads?.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2">Exam Files:</Typography>
                  {e.uploads.map((u) =>
                                  u.file ? (
                                    <Box key={u.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Link component="button" onClick={() => handleDownload(u.id, u.file)} underline="hover">
                                        {u.file} {u.timeUploaded && `(${new Date(u.timeUploaded).toLocaleString()})`}
                                        {u.student && `  — ${u.student.name}`}
                                      </Link>
                                      {/* show delete when current user is owner (student) or teacher/admin */}
                                      {(currentRole === 'admin' || currentRole === 'teacher' || (u.student && String(u.student.id) === String(studentId))) && (
                                        <Button size="small" color="error" onClick={() => handleDeleteUpload(u.id)}>Delete</Button>
                                      )}
                                    </Box>
                                  ) : null
                  )}
                </Box>
              )}

              {/* Exam uploads: only teachers/admins may upload exam files */}
              {(currentRole === 'teacher' || currentRole === 'admin') && (
                <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center", flexWrap: "wrap" }}>
                  <Button variant="outlined" size="small" component="label">
                    Choose file
                    <input type="file" hidden onChange={(ev) => handleSelectFile("exam", e.examId, ev.target.files?.[0])} />
                  </Button>
                  <Typography variant="caption">{selectedFiles[`exam-${e.examId}`]?.name || "No file chosen"}</Typography>
                  <Button variant="contained" size="small" disabled={!!uploading[`exam-${e.examId}`]} onClick={() => handleUpload("exam", e.examId)}>
                    {uploading[`exam-${e.examId}`] ? "Uploading..." : "Upload"}
                  </Button>
                </Box>
              )}

              {!studentView && (
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Button size="small" onClick={() => { setEditingExam(e); setOpenExamModal(true); }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleExamDelete(e.examId)}>Delete</Button>
                </Box>
              )}
            </Box>
          ))}

          {!studentView && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditingExam(null); setOpenExamModal(true); }}>
              Add Exam
            </Button>
          )}
        </Box>
          {/* Grading (visible to teachers/admins) */}
          { (currentRole === 'teacher' || currentRole === 'admin') && (
            <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>Grading</Typography>
              <Typography variant="subtitle1">Assignments</Typography>
              {assignmentsForCourseFlat.length === 0 ? (
                <Typography>No assignments found.</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Assignment</TableCell>
                      <TableCell>Due</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignmentsForCourseFlat.map(a => {
                      const aid = a.assignmentId || a._id || a.id;
                      return (
                        <TableRow key={aid}>
                          <TableCell>{a.title || `Assignment ${aid}`}</TableCell>
                          <TableCell>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'}</TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" onClick={() => {
                              const map = {};
                              studentsForCourse.forEach(s => {
                                const sid = s.studentId || s._id || s.id;
                                const existing = assignmentGradesForCourse.find(g => ((g.assignmentId?.assignmentId || g.assignmentId?._id || g.assignmentId) === aid) && ((g.studentId?.studentId || g.studentId?._id || g.studentId) === sid));
                                map[sid] = existing ? (existing.score != null ? existing.score : '') : '';
                              });
                              setAssignmentAllEditing(map);
                              setAssignmentToGradeAll(a);
                              setAssignmentAllGraderOpen(true);
                            }}>Grade</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              

              <Typography variant="subtitle1" sx={{ mt: 2 }}>Exams</Typography>
              {exams.length === 0 ? (
                <Typography>No exams found.</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Exam</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exams.map(ex => {
                      const eid = ex.examId || ex._id || ex.id;
                      return (
                        <TableRow key={eid}>
                          <TableCell>{ex.title || `Exam ${eid}`}</TableCell>
                          <TableCell>{ex.date ? new Date(ex.date).toLocaleDateString() : '—'}</TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" onClick={() => {
                              const map = {};
                              studentsForCourse.forEach(s => {
                                const sid = s.studentId || s._id || s.id;
                                    // check grade read-model first
                                    let found = null;
                                    found = courseGradesForCourse.find(g => {
                                      const gid = g.examId?.examId || g.examId?._id || g.examId || g.exam;
                                      const gsid = g.studentId?.studentId || g.studentId?._id || g.studentId || (g.student && (g.student.studentId || g.student.id || g.student._id));
                                      return String(gid) === String(eid) && String(gsid) === String(sid);
                                    });
                                    // if not found in grade read-model, check student-exam read-models
                                    if (!found && Array.isArray(studentExamsForCourse)) {
                                      found = studentExamsForCourse.find(se => {
                                        const seSid = se.studentId?.studentId || se.studentId?._id || se.studentId || (se.student && (se.student.studentId || se.student.id || se.student._id));
                                        const seExam = se.examId?.examId || se.examId?._id || se.examId || se.exam;
                                        return String(seExam) === String(eid) && String(seSid) === String(sid);
                                      });
                                    }
                                    map[sid] = found ? (found.score != null ? found.score : '') : '';
                              });
                              setExamAllEditing(map);
                              setExamToGradeAll(ex);
                              setExamAllGraderOpen(true);
                            }}>Grade</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}

              <Typography variant="subtitle1" sx={{ mt: 2 }}>Students</Typography>
              {studentsForCourse.length === 0 ? (
                <Typography>No students found.</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Assignments</TableCell>
                      <TableCell>Exams</TableCell>
                      <TableCell>Course Score</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentsForCourse.map(s => (
                      <TableRow key={s._id || s.id}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>{s.email || '—'}</TableCell>
                        <TableCell>
                          { (s.assignmentScores && Object.keys(s.assignmentScores).length > 0) || (s.assignments && s.assignments.length > 0) ? (
                            <Tooltip title={
                              (s.assignments && s.assignments.length > 0 ? s.assignments.map(a => `${a.title}: ${a.score != null ? a.score : '—'}`).join('\n') : '')
                              || Object.entries(s.assignmentScores || {}).map(([aid, val]) => {
                                const title = (assignmentsForCourseFlat.find(x => ((x.assignmentId || x._id || x.id) === aid)) || {}).title || aid;
                                return `${title}: ${val != null ? val : '—'}`;
                              }).join('\n')
                            }>
                              <span>{ (s.assignments && s.assignments.length > 0 ? s.assignments.map(a => a.score != null ? `${a.score}` : '—').join(', ') : Object.values(s.assignmentScores || {}).map(v => v != null ? `${v}` : '—').join(', ')) }</span>
                            </Tooltip>
                          ) : '—'}
                        </TableCell>
                        <TableCell>
                          { (s.examScores && Object.keys(s.examScores).length > 0) || (s.exams && s.exams.length > 0) ? (
                            <Tooltip title={
                              (s.exams && s.exams.length > 0 ? s.exams.map(e => `${e.title}: ${e.score != null ? e.score : '—'}`).join('\n') : '')
                              || Object.entries(s.examScores || {}).map(([eid, val]) => {
                                const title = (exams.find(x => ((x.examId || x._id || x.id) === eid)) || {}).title || eid;
                                return `${title}: ${val != null ? val : '—'}`;
                              }).join('\n')
                            }>
                              <span>{ (s.exams && s.exams.length > 0 ? s.exams.map(e => e.score != null ? `${e.score}` : '—').join(', ') : Object.values(s.examScores || {}).map(v => v != null ? `${v}` : '—').join(', ')) }</span>
                            </Tooltip>
                          ) : '—'}
                        </TableCell>
                        <TableCell>{s.courseScore != null ? s.courseScore : '—'}</TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined" onClick={() => { setStudentToGrade(s); setStudentGraderOpen(true); }}>Grade</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          )}

          {/* Student read-only grading view (for students/studentView) */}
          { (currentRole === 'student' || studentView) && (
            <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
              <Typography variant="h5" gutterBottom>Your Grades</Typography>
              { studentsForCourse && studentsForCourse.length > 0 ? (
                (() => {
                  const me = studentsForCourse.find(s => String(s.studentId || s._id || s.id) === String(studentId));
                  if (!me) return <Typography>No grade information available.</Typography>;
                  return (
                    <>
                      <Typography variant="subtitle2">Course %: {me.courseScore != null ? String(me.courseScore) + '%' : '—'}</Typography>
                      <Typography variant="subtitle1" sx={{ mt: 1 }}>Assignments</Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow><TableCell>Assignment</TableCell><TableCell>Score</TableCell></TableRow>
                        </TableHead>
                        <TableBody>
                          {(me.assignments || []).map(a => (
                            <TableRow key={String(a.assignmentId)}>
                              <TableCell>{a.title}</TableCell>
                              <TableCell>{a.score != null ? a.score : '0'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Typography variant="subtitle1" sx={{ mt: 1 }}>Exams</Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow><TableCell>Exam</TableCell><TableCell>Score</TableCell></TableRow>
                        </TableHead>
                        <TableBody>
                          {(me.exams || []).map(e => (
                            <TableRow key={String(e.examId)}>
                              <TableCell>{e.title}</TableCell>
                              <TableCell>{e.score != null ? e.score : '0'}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  );
                })()
              ) : (
                <Typography>No grade information available.</Typography>
              )}
            </Box>
          )}

          {/* Modals */}
        {!studentView && (
          <>
            <LectureModal open={openLectureModal} courseId={courseId} lecture={editingLecture} onClose={() => setOpenLectureModal(false)} onSave={handleLectureSave} />
            <AssignmentModal open={openAssignmentModal} lectureId={currentLectureId} assignment={editingAssignment} onClose={() => setOpenAssignmentModal(false)} onSave={handleAssignmentSave} />
            <ExamModal open={openExamModal} courseId={courseId} exam={editingExam} onClose={() => setOpenExamModal(false)} onSave={handleExamSave} />
          </>
        )}
          {/* Assignment All grader dialog */}
          <Dialog open={assignmentAllGraderOpen} onClose={() => setAssignmentAllGraderOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Grade: {assignmentToGradeAll?.title || assignmentToGradeAll?.assignmentId}</DialogTitle>
            <DialogContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentsForCourse.map(s => {
                    const sid = s.studentId || s._id || s.id;
                    return (
                      <TableRow key={sid}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>
                          <TextField size="small" type="number" value={assignmentAllEditing[sid] ?? ''} onChange={(e) => setAssignmentAllEditing(m => ({ ...m, [sid]: e.target.value }))} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAssignmentAllGraderOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={async () => {
                const aid = assignmentToGradeAll?.assignmentId || assignmentToGradeAll?._id || assignmentToGradeAll?.id;
                for (const sid of Object.keys(assignmentAllEditing)) {
                  const val = assignmentAllEditing[sid];
                  if (val !== undefined && val !== '') await saveAssignmentGrade(sid, aid, val);
                }
                setAssignmentAllGraderOpen(false);
              }}>Save All</Button>
            </DialogActions>
          </Dialog>

          {/* Exam All grader dialog */}
          <Dialog open={examAllGraderOpen} onClose={() => setExamAllGraderOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Grade: {examToGradeAll?.title || examToGradeAll?.examId}</DialogTitle>
            <DialogContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentsForCourse.map(s => {
                    const sid = s.studentId || s._id || s.id;
                    return (
                      <TableRow key={sid}>
                        <TableCell>{s.name}</TableCell>
                        <TableCell>
                          <TextField size="small" type="number" value={examAllEditing[sid] ?? ''} onChange={(e) => setExamAllEditing(m => ({ ...m, [sid]: e.target.value }))} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setExamAllGraderOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={async () => {
                const eid = examToGradeAll?.examId || examToGradeAll?._id || examToGradeAll?.id;
                for (const sid of Object.keys(examAllEditing)) {
                  const val = examAllEditing[sid];
                  if (val !== undefined && val !== '') await saveCourseGrade(sid, courseId, val, eid);
                }
                setExamAllGraderOpen(false);
              }}>Save All</Button>
            </DialogActions>
          </Dialog>

          {/* Single student grade dialog */}
          <SingleStudentGradeDialog
            open={studentGraderOpen}
            student={studentToGrade}
            assignments={assignmentsForCourseFlat}
            exams={exams}
            matrixEditing={matrixEditing}
            setMatrixEditing={setMatrixEditing}
            assignmentPoints={assignmentPoints}
            examPoints={examPoints}
            onClose={() => setStudentGraderOpen(false)}
            onSaveStudent={async (s) => {
              const sid = s.studentId || s._id || s.id;
              for (const a of assignmentsForCourseFlat) {
                const aid = a.assignmentId || a._id || a.id;
                const key = `${sid}:${aid}`;
                const val = matrixEditing[key];
                if (val !== undefined && val !== '') await saveAssignmentGrade(sid, aid, val);
              }
              for (const ex of exams) {
                const eid = ex.examId || ex._id || ex.id;
                const key = `ex:${sid}:${eid}`;
                const val = matrixEditing[key];
                if (val !== undefined && val !== '') await saveCourseGrade(sid, courseId, val, eid);
              }
              setStudentGraderOpen(false);
              await fetchGrades();
            }}
          />
      </Box>
    );
}
