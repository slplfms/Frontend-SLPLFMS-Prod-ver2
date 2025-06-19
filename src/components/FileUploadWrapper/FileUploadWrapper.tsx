import React, { useState, ChangeEvent } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import LinearProgress from "@mui/material/LinearProgress";
import UploadIcon from "@mui/icons-material/Upload";
import {
  createVehicleDoc,
  deleteVehicleDoc,
} from "../../Services/vehiclsDocuments-Service";
import {
  createUserDoc,
  deleteUserDoc,
} from "../../Services/userDocuments-Service";
import { toast } from "sonner";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

interface FileUploadWrapperProps {
  mode: "vehicle" | "user";
  id: string;
  type: number;
  title: string;
  user?: any;
  fileObj?: any;
  onUploadSuccess?: () => void;
  requiredExpiry: boolean;
  docsExpiryDate?: string,
}

const FileUploadWrapper: React.FC<FileUploadWrapperProps> = ({
  title,
  id,
  mode,
  type,
  requiredExpiry,
  fileObj,
  onUploadSuccess,
  docsExpiryDate,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [expiryDate, setExpiryDate] = useState<any>(fileObj.expiryDate);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    // Validate inputs before starting progress simulation
    if (requiredExpiry && !expiryDate) {
      toast.error("Enter an Expiry Date");
      return; // Prevent the submission
    }

    const formData = new FormData();

    formData.append(mode === "user" ? "userId" : "vehicleId", id);
    formData.append("fileName", file.name);
    formData.append("type", type.toString());
    formData.append("docFile", file);

    if (requiredExpiry) {
      formData.append("expiryDate", expiryDate);
    }

    setLoading(true);
    setProgress(0);

    const simulateProgress = () => {
      setProgress((prevProgress) => {
        const targetProgress = 100;
        const increment = Math.max(
          1,
          Math.ceil((targetProgress - prevProgress) / 1.1)
        );
        const nextProgress = Math.min(prevProgress + increment, targetProgress);
        return nextProgress;
      });
    };

    const interval = setInterval(simulateProgress, 500);

    try {
      const response =
        mode === "vehicle"
          ? await createVehicleDoc(formData)
          : await createUserDoc(formData);
      response
        ? toast.success("File uploaded successfully")
        : toast.error("Error uploading file");
      setFile(null);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setProgress(100);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      if (mode === "vehicle") {
        await deleteVehicleDoc(id);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        await deleteUserDoc(id);
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      toast.success("Document Deleted Successfully");
      setProgress(0);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    if (!!fileObj?.url) {
      toast.warning(
        "File already exists. Please delete the existing file before uploading a new one."
      );
      return;
    }
    handleUpload();
  };
  return (
    <>
      <Card
        sx={{ p: 3, minHeight: mode === "vehicle" ? 210 : 174 }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          position: "relative",
        }}
      >
        <Typography variant="h6" color="primary" fontWeight={600}>
          {title}
        </Typography>
        {!!fileObj?.url ? (
          <>
            <Typography
              sx={{
                borderRadius: "5px",
                border: "1px solid lightgreen",
                p: 1,
                // width: "80%",
                overflow: "hidden",
                whiteSpace: "wrap",
                textOverflow: "ellipsis",
              }}
            >
              {fileObj.fileName}
            </Typography>
            {requiredExpiry &&
              <Typography>
                <span style={{ fontWeight: "600", color: "#637FFF" }}>Expiry Date :</span> {dayjs(docsExpiryDate).format("MMM D, YYYY")}
              </Typography>
            }
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              gap={2}
            // my={2}
            >
              <Link
                to={`https://storageslplfmsprod.blob.core.windows.net/${fileObj.url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View
              </Link>
              <Button
                onClick={() => {
                  handleDelete(fileObj.id);
                }}
                sx={{ borderRadius: "5px" }}
                variant="text"
                color="warning"
                disabled={loading}
                endIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", gap: "10px" }}>
              <input
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id={`file-upload-${type}`}
              />
              <label htmlFor={`file-upload-${type}`}>
                <Button
                  variant="outlined"
                  component="span"
                  sx={{ borderRadius: "5px" }}
                >
                  Choose File
                </Button>
              </label>
              <Button
                onClick={handleUploadClick}
                sx={{ borderRadius: "5px" }}
                variant="contained"
                color="primary"
                disabled={!file || loading}
                endIcon={<UploadIcon />}
              >
                Upload
              </Button>
            </Box>
            {requiredExpiry && (
              <Box id={type.toString()}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      value={expiryDate}
                      onChange={(newValue) => setExpiryDate(newValue)}
                      label="Expiry Date"
                      disabled={!requiredExpiry}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
            )}
          </>
        )}
        {loading && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ width: "100%", mt: 2 }}
          />
        )}
      </Card>
    </>
  );
};

export default FileUploadWrapper;
