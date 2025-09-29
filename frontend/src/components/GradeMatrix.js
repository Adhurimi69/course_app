import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TextField, Button } from '@mui/material';

export default function GradeMatrix({ assignments = [], students = [], matrixEditing = {}, setMatrixEditing = () => {}, onSaveRow = () => {}, onOpenStudentGrader = () => {}, assignmentPoints = {} }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Student</TableCell>
          {assignments.map(a => (
            <TableCell key={a.assignmentId || a.id || a._id}>{a.title || a.assignmentId}</TableCell>
          ))}
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {students.map(s => {
          const sid = s.studentId || s._id || s.id;
          return (
            <TableRow key={sid} hover>
              <TableCell sx={{ cursor: 'pointer' }} onClick={() => onOpenStudentGrader?.(s)}>{s.name}</TableCell>
              {assignments.map(a => {
                const aid = a.assignmentId || a._id || a.id;
                const key = `${sid}:${aid}`;
                const max = assignmentPoints ? (assignmentPoints[aid] ?? assignmentPoints[aid?.toString()]) : undefined;
                return (
                  <TableCell key={key}>
                    <TextField
                      size="small"
                      type="number"
                      value={matrixEditing[key] ?? ''}
                      onChange={(e) => setMatrixEditing(m => ({ ...m, [key]: e.target.value }))}
                      sx={{ width: 100 }}
                      inputProps={{ min: 0, max: max != null ? max : undefined, step: '0.01' }}
                      helperText={max != null ? `Max ${max}` : ''}
                    />
                  </TableCell>
                );
              })}
              <TableCell>
                <Button size="small" variant="contained" onClick={() => onSaveRow?.(s)}>Save Row</Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
