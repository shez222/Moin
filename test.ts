/**
 * create-printful-mockup.ts
 *
 * Example function to create and retrieve mockups from Printful.
 *
 * Usage: 
 *   1) Set PRINTFUL_API_KEY in your environment.
 *   2) call createPrintfulMockup() with the desired variant IDs and image URL.
 */

interface CreateTaskResponse {
  code: number;
  result: {
    task_key: string;
    [key: string]: any;
  };
}

interface CheckTaskResponse {
  code: number;
  result: {
    status: "pending" | "completed" | "failed";
    mockups?: Array<any>;
    [key: string]: any;
  };
}

const PRINTFUL_API_KEY =  "s5Nn5mjWO9eYwBzkndm4ghHjgOAIPkhmeJIHS02y"; // e.g. "xxxxxxxx-xxxxxxxxxxxx-xxxxxxxxx"

async function createPrintfulMockup(
  variantIds: number[],
  imageUrl: string,
  format: "png" | "jpg" = "png"
) {
  if (!PRINTFUL_API_KEY) {
    throw new Error("Missing Printful API key. Set PRINTFUL_API_KEY in env.");
  }

  // 1) Create a task
  const createTaskRes = await fetch("https://api.printful.com/mockup-generator/create-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PRINTFUL_API_KEY}`,
    },
    body: JSON.stringify({
      variant_ids: variantIds, // e.g. [4011]
      format,                  // "png" or "jpg"
      files: [
        {
          placement: "default",
          image_url: imageUrl, 
        },
      ],
    }),
  });

  if (!createTaskRes.ok) {
    const errBody = await createTaskRes.text();
    throw new Error(`Error creating mockup task. ${createTaskRes.status} => ${errBody}`);
  }

  const createTaskData: CreateTaskResponse = await createTaskRes.json();
  if (createTaskData.code !== 200) {
    throw new Error(`Create task error code: ${createTaskData.code}`);
  }

  const taskKey = createTaskData.result.task_key;
  console.log("Task created, key:", taskKey);

  // 2) Poll for the result
  let attempts = 0;
  const maxAttempts = 10;
  let mockups: any[] = [];

  while (attempts < maxAttempts) {
    attempts++;

    const checkRes = await fetch(`https://api.printful.com/mockup-generator/task?task_key=${taskKey}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PRINTFUL_API_KEY}`,
      },
    });

    if (!checkRes.ok) {
      const errBody = await checkRes.text();
      throw new Error(`Error checking mockup task. ${checkRes.status} => ${errBody}`);
    }

    const checkData: CheckTaskResponse = await checkRes.json();
    if (checkData.code !== 200) {
      throw new Error(`Check task error code: ${checkData.code}`);
    }

    const status = checkData.result.status;
    console.log(`Task status: ${status}`);

    if (status === "completed") {
      // we have final mockups
      mockups = checkData.result.mockups || [];
      console.log("Mockups are ready!");
      break;
    } else if (status === "failed") {
      throw new Error("Mockup generation failed on Printful side.");
    } else {
      // "pending" – keep polling
      if (attempts < maxAttempts) {
        console.log("Still processing... will retry in 2s");
        await new Promise((res) => setTimeout(res, 2000));
      } else {
        throw new Error("Mockup generation timed out after too many attempts.");
      }
    }
  }

  // 3) Return the final mockups array
  return mockups; // each item contains the image URLs, placement data, etc.
}

// Example usage
(async () => {
  try {
    // For a T-shirt (e.g., variant_id: 4011), see Printful docs or “GET /products” for valid IDs
    const variantIDs = [4011];
    const userDesignUrl = "https://example.com/path/to/your/design.png";

    const generatedMockups = await createPrintfulMockup(variantIDs, userDesignUrl);
    console.log("Final mockups:\n", JSON.stringify(generatedMockups, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
})();
