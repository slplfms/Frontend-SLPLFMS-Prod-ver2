import { ImportExport } from "@mui/icons-material";
import { Box, Grid, Modal, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Importer, ImporterField } from "react-csv-importer";

import "react-csv-importer/dist/index.css";
import { importData } from "../../Services/ImportCsvService";
import AuthRequired from "../auth/auth-required";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  width: "80vw",
  maxWidth: 1400,
  borderRadius: 1,
  maxHeight: "90vh",
  overflow: "auto",
};

import { toast } from "sonner";


const CsvImportComponent = ({
  type,
  headers,
  onComplete,
}: {
  type: string;
  headers: { label: string; id: string; optional: boolean }[];
  onComplete: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [accepted, setAccepted] = useState<any>([]);
  const [rejected, setRejected] = useState<any>([]);
  const [failed, setFailed] = useState<any[]>([]);

  useEffect(()=>{
    setAccepted([]);
    setRejected([]);
    setFailed([]);
  }, [isOpen])

  const uploadData = async (data: any[]) => {
    return importData(type, { data });
  };

  return (
    <>
      <AuthRequired type="button" permissions={["importCsv"]}>
        <Grid item>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => setIsOpen(true)}
          >
            <ImportExport />
            <Typography variant="subtitle1">Import</Typography>
          </div>
        </Grid>
      </AuthRequired>
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Importer
            dataHandler={async (rows) => {
              try {
                const res = await uploadData(rows);
                const {
                  data: { accepted: _accepted, rejected: _rejected },
                } = res;

                setRejected((pre: any) => [...pre, ..._rejected]);
                setAccepted((pre: any) => [...pre, ..._accepted]);
              } catch (e) {
                console.log(e);
                setFailed((pre: any[]) => [...pre, ...rows]);
              }
            }}
            defaultNoHeader={false}
            restartable={false}
            onClose={() => {
              onComplete && onComplete();
              setIsOpen(false);
            }}
            onComplete={(_)=>{
              toast.info(`Import completed! (Added:${accepted?.length}  , Skipped:${rejected?.length} , Failed: ${failed?.length} )`)
            }}
          >
            {headers?.map((h) => (
              <ImporterField
                key={h.id}
                name={h.id}
                label={h.label}
                optional={!!h.optional}
              />
            ))}
          </Importer>
        </Box>
      </Modal>
    </>
  );
};

export default CsvImportComponent;
