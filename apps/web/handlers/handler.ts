const DOMAIN = "http://localhost:4000/api/v1";

export const addWebsite = ({ webUri }: { webUri: string }) => {
  return async () => {
    const response = await fetch(`${DOMAIN}/uri`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uri: webUri,
      }),
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Request Failed");
    }
    const data = await response.json();
    return data;
  };
};

export const chat = ({
  jobid,
  message,
}: {
  jobid: string;
  message: string;
}) => {
  return async () => {
    try {
      const response = await fetch(`${DOMAIN}/chat/${jobid}`, {
        headers: {
          "Content-Type": "application/json",
          "Transfer-Encoding": "chunked",
        },
        body: JSON.stringify({
          message: message,
        }),
        method: "POST",
      });
      const data = await response.text();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong");
    }
  };
};
