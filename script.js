function addStudentRow() {
  let table = document.getElementById("studentTable");
  let rowCount = table.rows.length;
  let row = table.insertRow(rowCount);

  // Student name input
  let cell1 = row.insertCell(0);
  let studentNameInput = document.createElement("input");
  studentNameInput.type = "text";
  studentNameInput.id = "studentName" + rowCount;
  studentNameInput.placeholder = "Enter Student Name";
  studentNameInput.required = true;
  cell1.appendChild(studentNameInput);

  // Correct answers input
  let cell2 = row.insertCell(1);
  let correctAnswersInput = document.createElement("input");
  correctAnswersInput.type = "number";
  correctAnswersInput.id = "correctAnswers" + rowCount;
  correctAnswersInput.placeholder = "Correct Answers";
  correctAnswersInput.required = true;
  cell2.appendChild(correctAnswersInput);
}

function generateReport() {
  let examType = document.getElementById("examType").value;
  let subjectName = document.getElementById("subjectName").value;
  let paperName = document.getElementById("papername").value;
  let totalQuestions = parseInt(document.getElementById("totalQuestions").value);

  if (!examType || !subjectName || !paperName || !totalQuestions) {
    alert("Please fill out all fields.");
    return;
  }

  let table = document.getElementById("studentTable");
  let studentDetails = [];
  for (let i = 1; i < table.rows.length; i++) {
    let studentName = document.getElementById("studentName" + i).value;
    let correctAnswers = parseInt(document.getElementById("correctAnswers" + i).value);
    if (studentName && correctAnswers >= 0) {
      let marks = (correctAnswers / totalQuestions) * 100;
      let wrongAnswers = totalQuestions - correctAnswers;
      studentDetails.push({
        name: studentName,
        marks: marks,
        correctAnswers: correctAnswers,
        wrongAnswers: wrongAnswers
      });
    }
  }

  document.getElementById("reportExamType").textContent = examType;
  document.getElementById("reportSubjectName").textContent = subjectName;
  document.getElementById("reportPaperName").textContent = paperName;

  let totalMarks = 0;
  studentDetails.forEach(student => totalMarks += student.marks);

  let avgMarks = totalMarks / studentDetails.length;

  // Find top and lowest scorers
  let maxMarks = Math.max(...studentDetails.map(s => s.marks));
  let minMarks = Math.min(...studentDetails.map(s => s.marks));
  let topScorers = studentDetails.filter(student => student.marks === maxMarks);
  let lowScorers = studentDetails.filter(student => student.marks === minMarks);

  let resultsTable = document.getElementById("resultsTable");
  resultsTable.innerHTML = `
    <tr>
      <th>Student Name</th>
      <th>Marks</th>
      <th>Correct Answers</th>
      <th>Wrong Answers</th>
      <th>Grade</th>
    </tr>
  `;
  studentDetails.forEach(student => {
    let row = resultsTable.insertRow();
    row.insertCell(0).textContent = student.name;
    row.insertCell(1).textContent = student.marks.toFixed(2);
    row.insertCell(2).textContent = student.correctAnswers;
    row.insertCell(3).textContent = student.wrongAnswers;
    row.insertCell(4).textContent = getGrade(student.marks);
  });

  document.getElementById("avgMarks").textContent = avgMarks.toFixed(2);

  let topScorerText = topScorers.map(s => `${s.name} (${s.marks.toFixed(2)} marks)`).join(", ");
  let lowScorerText = lowScorers.map(s => `${s.name} (${s.marks.toFixed(2)} marks)`).join(", ");

  document.getElementById("topScorer").textContent = topScorerText;
  document.getElementById("lowScorer").textContent = lowScorerText;
}

function getGrade(marks) {
  if (marks >= 85) return "A+";
  if (marks >= 75) return "A";
  if (marks >= 70) return "A-";
  if (marks >= 65) return "B+";
  if (marks >= 60) return "B";
  if (marks >= 55) return "B-";
  if (marks >= 50) return "C+";
  if (marks >= 45) return "C";
  if (marks >= 40) return "C-";
  if (marks >= 35) return "D";
  return "F";
}

function downloadPDF() {
  const resultSection = document.getElementById("report");

  // Check if resultSection has content
  if (!resultSection || resultSection.innerHTML.trim() === '') {
      alert("No result to download!");
      return;
  }

  const paperName = document.getElementById('papername').value.trim();

  // Generate the filename in the desired format: paper name + name + Progress Report
  const filename = `${paperName || 'Unknown'} Exams_Marks_Summery_Report.pdf`;

  // Use html2pdf to convert the content of #resultSection to PDF
  const options = {
      margin: 1,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generate PDF from the content of #resultSection
  html2pdf().from(resultSection).set(options).save();
}