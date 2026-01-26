import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);

	const sendMessage = async (receiverId, message, image = null, audio = null) => {
		setLoading(true);
		try {
			const formData = new FormData();
			if (message) formData.append("message", message);
			if (image) formData.append("image", image);
			if (audio) formData.append("audio", audio);

			const res = await axios.post(
				`${serverUrl}/api/message/send/${receiverId}`,
				formData,
				{ 
					withCredentials: true,
					headers: { "Content-Type": "multipart/form-data" }
				}
			);
			return res.data;
		} catch (error) {
			console.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};

export default useSendMessage;
