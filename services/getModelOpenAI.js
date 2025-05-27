import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

//DELETE A ESTE
export const getModelOpenAI = async () => {
  try {
    const docRef = doc(db, "configuration", "model"); // nombre exacto de colección y doc
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const modelo = docSnap.data().openAIModel;
      return modelo || "gpt-3.5-turbo"; // fallback en caso de que no exista el campo
    } else {
      console.warn("📭 Documento 'model' no encontrado.");
      return "gpt-3.5-turbo";
    }
  } catch (error) {
    console.error("🚨 Error al obtener modelo desde Firestore:", error);
    return "gpt-3.5-turbo";
  }
};
