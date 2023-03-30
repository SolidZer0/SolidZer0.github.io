import React, { useState } from "react";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

// Register the plugins
registerPlugin(FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

const FileUpload = ({traduccion={}}) => {
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  return (
    <fieldset className='fieldset buscar_viaje_container venta_container'>      
      <div style={{"marginTop": "1rem"}} className="buscar_viaje">
        <legend className='legend'>{"t10uploadcustomset" in traduccion ? traduccion.t10uploadcustomset : "Cargar Custom Set"}</legend>
        <FilePond
          server={{
            process: {
              url: "/api/sets/upload",
              onerror: setErrorMsg
            }
          }}
          allowRevert={false}
          maxFileSize={"3MB"}
          acceptedFileTypes={["application/json", "text/xml"]}
          allowMultiple={true}
          files={files}
          labelIdle={`${"t11dragdrop1" in traduccion ? traduccion.t11dragdrop1 : "Arrastra tu archivo aquí, o"} <span class="filepond--label-action">${"t12dragdrop2" in traduccion ? traduccion.t12dragdrop2 : "Explorar"}</span><br/>
          ${"t13dragdrop" in traduccion ? traduccion.t13dragdrop : "Soporte para formato JSON (MTGJSON v4/v5) y/o XML (Cockatrice v3/v4)."}`}
          labelFileProcessingError={errorMsg}
          onupdatefiles={fileItems => {
            // Set currently active file objects to this.state
            setFiles(fileItems.map(fileItem => fileItem.file));
          }}
        />
      </div>
    </fieldset>
  );
};

export default FileUpload;
