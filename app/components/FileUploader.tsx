import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

const FileUploader = () => {
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div className='w-full gradient-border'>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p>Drop the files here ...</p> :
                        <p>Drag 'n' drop some files here, or click to select files</p>
                }
            </div>
        </div>
    )
}

export default FileUploader;