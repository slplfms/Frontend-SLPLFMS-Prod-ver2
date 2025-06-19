import { useState, useEffect, useCallback, useMemo } from "react";
import { Grid } from "@mui/material";
import FileUploadWrapper from "../FileUploadWrapper/FileUploadWrapper";
import { useSearchParams } from "react-router-dom";
import { getUserDocuments } from "../../Services/UserService";
import { userDocumentsMap } from "../../constants/documents";

export default function UserDocuments() {
  const [docs, setDocs] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("userId");

  const fetchUserDocuments = useCallback(async (userId: string) => {
    try {
      const data = await getUserDocuments(userId);
      setDocs(data.userDocuments);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, []);

  const userDocuments = useMemo(() => {
    const temp = JSON.parse(JSON.stringify(userDocumentsMap));
    docs.forEach((doc) => {
      const { fileName, expiryDate, url, id, type } = doc;
      Object.assign(temp[type], { fileName, expiryDate, url, id });
    });

    const newList =Array.from(Object.values(temp)).sort(
      (a: any, b: any) => a.orderNumber - b.orderNumber
    );
    return newList
  }, [docs]);

  useEffect(() => {
    if (id) {
      fetchUserDocuments(id);
    }
  }, [id, fetchUserDocuments]);

  const refreshUserDocuments = useCallback(() => {
    if (id) {
      fetchUserDocuments(id);
    }
  }, [id, fetchUserDocuments]);

  return (
    <>
      <Grid container spacing={2} mt={1}>
        {userDocuments?.map((row:any) => (
          <Grid item xs={12} sm={6} md={4} key={row?.type}>
            <FileUploadWrapper
              type={row.type}
              title={row.title}
              id={id || ""}
              mode="user"
              fileObj={row}
              onUploadSuccess={refreshUserDocuments}
              requiredExpiry={row.requiredExpiry}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
