const RPC_URL = "https://fullnode.devnet.sui.io"; // Endpoint-ul RPC Sui (Devnet)

// Funcție generică pentru apeluri RPC
export const callSuiRPC = async (method, params) => {
  try {
    const response = await fetch(RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data.result;
  } catch (error) {
    console.error("Error calling Sui RPC:", error.message);
    throw error;
  }
};

// Funcție pentru a obține obiectele deținute de o adresă
export const getOwnedObjects = async (address) => {
  try {
    const params = [address];
    const result = await callSuiRPC("suix_getOwnedObjects", params);
    return result.data || [];
  } catch (error) {
    console.error("Error fetching owned objects:", error.message);
    throw error;
  }
};

// Funcție pentru a obține informații despre un obiect specific
// Funcție pentru a obține informații despre un obiect specific
export const getObjectDetails = async (objectId) => {
  try {
    const params = [objectId]; // Obiect ID trebuie să fie într-un array
    const result = await callSuiRPC("sui_getObject", params);
    return result;
  } catch (error) {
    console.error("Error fetching object details:", error.message);
    throw error;
  }
};


// Funcție pentru a apela un smart contract Move
export const callMoveFunction = async (
  packageId,
  moduleName,
  functionName,
  args,
  gasObject,
  gasBudget
) => {
  try {
    const params = {
      packageObjectId: packageId,
      module: moduleName,
      function: functionName,
      typeArguments: [],
      arguments: args,
      gasPayment: gasObject,
      gasBudget,
    };
    const result = await callSuiRPC("sui_moveCall", params);
    return result;
  } catch (error) {
    console.error("Error calling Move function:", error.message);
    throw error;
  }
};


// Funcția de mint pentru contractul tău
export const mintTokens = async (packageId, moduleName, functionName, args, gasObject, gasBudget) => {
  const params = {
    packageObjectId: packageId,
    module: moduleName,
    function: functionName,
    typeArguments: [],
    arguments: args,
    gasPayment: gasObject,
    gasBudget,
  };

  console.log("Calling sui_moveCall with params:", params);
  try {
    return await callSuiRPC("sui_moveCall", params);
  } catch (error) {
    console.error("Error calling mintTokens:", error.message);
    throw error;
  }
};


