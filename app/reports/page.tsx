"use client";

import { useAuth } from "@/hooks/use-auth";
import { useReportedIssues } from "@/hooks/use-reported-issues";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Bug,
} from "lucide-react";
import Link from "next/link";
import { formatTopicName } from "@/lib/utils";
import { ReportStatus } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useReports } from "@/hooks/use-reports";

const statusConfig: Record<
  ReportStatus,
  { icon: React.ComponentType; className: string; label: string }
> = {
  pending: {
    icon: Clock,
    className:
      "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
    label: "Pending Review",
  },
  resolved: {
    icon: CheckCircle,
    className:
      "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    label: "Resolved",
  },
  rejected: {
    icon: XCircle,
    className: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    label: "Rejected",
  },
};

export default function ReportsPage() {
  const { user } = useAuth(true);
  const { reportedIssues, isLoading } = useReportedIssues(user?.id ?? null);
  const { reportIssue, isSubmitting } = useReports(user?.id ?? null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const handleReportSubmit = async () => {
    const success = await reportIssue({
      questionId: null, // Indicate this is a general issue
      issueType: reportType,
      description: reportDescription,
    });

    if (success) {
      setIsReportDialogOpen(false);
      setReportType("");
      setReportDescription("");
    }
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Reported Issues</h1>
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 w-full sm:w-auto bg-background dark:bg-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <Dialog
            open={isReportDialogOpen}
            onOpenChange={setIsReportDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-background dark:bg-gray-900"
              >
                <Bug className="h-4 w-4" />
                Report an Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle>Report an Issue</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <RadioGroup value={reportType} onValueChange={setReportType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="technical" id="technical" />
                    <Label htmlFor="technical">Technical Issue</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="suggestion" id="suggestion" />
                    <Label htmlFor="suggestion">Suggestion</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>

                <Textarea
                  placeholder="Describe the issue..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="bg-background dark:bg-gray-800"
                />

                <Button
                  onClick={handleReportSubmit}
                  disabled={!reportType || !reportDescription || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Issue"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {reportedIssues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              You haven't reported any issues yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {reportedIssues.map((report) => {
              const status = statusConfig[report.status as ReportStatus];
              const StatusIcon = status.icon;

              return (
                <Card
                  key={report.id}
                  className="p-4 sm:p-6 bg-background dark:bg-gray-900"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div>
                        {report.questions && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Topic: {formatTopicName(report.questions.topic)}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Reported on:{" "}
                          {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded ${status.className} flex items-center gap-1 whitespace-nowrap`}
                        >
                          <StatusIcon aria-hidden="true" />
                          {status.label}
                        </span>
                        <span className="text-sm font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded whitespace-nowrap">
                          {report.issue_type.charAt(0).toUpperCase() +
                            report.issue_type.slice(1)}
                        </span>
                      </div>
                    </div>

                    {report.questions && (
                      <div>
                        <h3 className="font-medium mb-2">Question</h3>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {report.questions.question_text}
                        </p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-medium mb-2">Issue Description</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {report.description}
                      </p>
                    </div>

                    {report.admin_comment && (
                      <div className="border-t pt-4 mt-4">
                        <span className="text-sm font-medium px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded mb-2">
                          Admin Response
                        </span>
                        <p className="text-gray-700 dark:text-gray-300 mt-3">
                          {report.admin_comment}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
