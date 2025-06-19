import { useState, useEffect, useCallback, useMemo } from "react";
import { Grid } from "@mui/material";
import FileUploadWrapper from "../FileUploadWrapper/FileUploadWrapper";
import { useSearchParams } from "react-router-dom";
import { vehicleDocumentsMap } from "../../constants/documents";
import { getVehiclesDocs } from "../../Services/vehiclsDocuments-Service";

export default function UserDocuments() {
  const [docs, setDocs] = useState([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("vehicleId");

  const fetchVehicleDocuments = useCallback(async (vehicleId: string) => {
    try {
      const data = await getVehiclesDocs(vehicleId);
      setDocs(data.vehicleDocuments);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchVehicleDocuments(id);
    }
  }, [id, fetchVehicleDocuments]);

  const refreshVehicleDocuments = useCallback(() => {
    if (id) {
      fetchVehicleDocuments(id);
    }
  }, [id, fetchVehicleDocuments]);

  const vehicleDocuments = useMemo(() => {
    const temp = JSON.parse(JSON.stringify(vehicleDocumentsMap));
    docs?.forEach((doc) => {
      const { fileName, expiryDate, url, id, type } = doc;
      Object.assign(temp[type], { fileName, expiryDate, url, id });
    });

    const newList = Array.from(Object.values(temp))
    return newList;
  }, [docs]);

  return (
    <>
      <Grid container spacing={2} mt={1}>
        {vehicleDocuments.map((row:any) => (
          <Grid item xs={12} sm={6} md={4} key={row.type}>
            <FileUploadWrapper
              type={row.type.toString()}
              title={row.title}
              id={id || ''}
              mode="vehicle"
              fileObj={row}
              onUploadSuccess={refreshVehicleDocuments}
              requiredExpiry={true}
              docsExpiryDate={row.expiryDate}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
