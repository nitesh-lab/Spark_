import { supabase } from "./createSupabaseclient";
import {v4 as uuid} from "uuid";
import fs from "fs";

export async function uploadFileToSupabaseBucket(path:string) {

   

    try {        
        const unique_name=uuid();
        
        const img_data:Buffer=fs.readFileSync(path)

      const { data, error } = await supabase.storage
        .from("Spark")
        .upload(`${unique_name}`, img_data);
  
       
      if (error) {
        console.error('Error uploading file:', error.message);
        return null;
      } else {
        return data;
      }
    } catch (error) {
    
    console.error('Error:',error);
      return null;
    }
  }
  