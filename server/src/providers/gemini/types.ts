export interface AttendanceAnalysisRequest {
  classroomId: string;
  classroomName: string;
  attendanceData: any;
  contextPrompt?: string;
}

export interface AttendanceAnalysisResult {
  summaryTh: string;
  insights: string[];
  recommendations: string[];
  flaggedStudents: Array<{
    studentName: string;
    issue: string;
    suggestedAction: string;
  }>;
}
