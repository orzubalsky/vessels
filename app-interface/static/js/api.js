export const getDirectoryListing = async (url = '/api/directory') => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.text();

    return data;
  } catch (error) {
    console.error('Error fetching directory listing:', error);
  }
}

const prepareFormData = formData => {
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value;
  });

  return data;
}

export const submitContribution = async (formData) => {
  const data = prepareFormData(formData);

  try {
    const response = await fetch('/api/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error('Error submitting contribution:', error);
  }
}
export const submitQuestion = async (formData) => {
  const data = prepareFormData(formData);

  try {
    const response = await fetch('/api/question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();

      return result;
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error('Error submitting contribution:', error);
  }
}