const UseMembers = async () => {
  try {
    const response = await fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    );
    return response.json();
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export default UseMembers;
