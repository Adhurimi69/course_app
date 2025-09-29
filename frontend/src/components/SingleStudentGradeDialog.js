import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableHead, TableRow, TableCell, TableBody, TextField, Typography } from '@mui/material';

export default function SingleStudentGradeDialog({ open = false, student = null, assignments = [], exams = [], matrixEditing = {}, setMatrixEditing = () => {}, onClose = () => {}, onSaveStudent = () => {}, assignmentPoints = {}, examPoints = {} }) {
  if (!student) return null;
  const sid = student.studentId || student._id || student.id;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Grades for {student.name}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Assignments</Typography>
        <Table size="small" sx={{ mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Assignment</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map(a => {
              const aid = a.assignmentId || a._id || a.id;
              const key = `${sid}:${aid}`;
              const max = assignmentPoints ? (assignmentPoints[aid] ?? assignmentPoints[aid?.toString()]) : undefined;
              return (
                <TableRow key={key}>
                  <TableCell>{a.title || aid}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={matrixEditing[key] ?? ''}
                      onChange={(e) => setMatrixEditing(m => ({ ...m, [key]: e.target.value }))}
                      inputProps={{ min: 0, max: max != null ? max : undefined, step: '0.01' }}
                      helperText={max != null ? `Max ${max}` : ''}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Typography variant="subtitle1">Exams</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Exam</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map(ex => {
              const eid = ex.examId || ex._id || ex.id;
              const key = `ex:${sid}:${eid}`;
              const max = examPoints ? (examPoints[eid] ?? examPoints[eid?.toString()]) : undefined;
              return (
                <TableRow key={key}>
                  <TableCell>{ex.title || eid}</TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      type="number"
                      value={matrixEditing[key] ?? ''}
                      onChange={(e) => setMatrixEditing(m => ({ ...m, [key]: e.target.value }))}
                      inputProps={{ min: 0, max: max != null ? max : undefined, step: '0.01' }}
                      helperText={max != null ? `Max ${max}` : ''}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSaveStudent?.(student)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
