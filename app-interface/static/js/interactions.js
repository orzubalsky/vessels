import {
  getDirectoryListing,
  submitContribution,
  submitQuestion
} from './api.js';

const updateDirectoryListingBreadcrumb = () => {
  const sourceContainer = document.querySelector('.directory-breadcrumbs--hidden');
  const targetContainer = document.querySelector('.directory-breadcrumbs--target');

  if (!sourceContainer || !targetContainer) return;

  // Get all a nodes of the source container
  let anchorNodes = sourceContainer.querySelectorAll('a');

  // Join nodes with a slash
  const breadcrumb = [ anchorNodes[0], ...[...anchorNodes].slice(3) ].map(node => node.outerHTML).join('/');

  // Update the target container
  targetContainer.innerHTML = breadcrumb;

  targetContainer.querySelectorAll('a').forEach((element, i) => {
    if (i === 0) {
      // Update the target container root link
      element.setAttribute('href', '/#listen');
    } else {
      // Remove /api from the url
      element.setAttribute('href', element.getAttribute('href').replace('/api', ''));
    }
  })

}

export const populateDirectoryListing = async (url = '/api/directory') => {
  const directoryElement = document.querySelector('.directory');

  if (!directoryElement) return

  try {
    const directoryData = await getDirectoryListing(url);

    // Update the HTML content after the data is fetched
    directoryElement.innerHTML = directoryData;

    // Update the breadcrumb
    updateDirectoryListingBreadcrumb();

    // Update the URL
    if (url !== '/api/directory') {
      window.history.pushState({}, '', url.replace('/api', ''));
    }

    // Directory links re-fetch html content
    document.querySelectorAll('.directory #files a').forEach((element) => {
      element.addEventListener('click', async (event) => {
        const href = element.getAttribute('href');

        // Check if the link is a directory or a file
        const isFile = element.querySelector('.size').innerHTML.length > 0;

        if (!isFile) {
          event.preventDefault();

          // Populate the directory listing
          await populateDirectoryListing(href);
        }
      })
    })

    // Breadcrumbs links re-fetch html content
    document.querySelectorAll('.directory .directory-breadcrumbs--target a').forEach((element) => {
      element.addEventListener('click', async (event) => {
        event.preventDefault();

        const href = element.getAttribute('href');

        let url = href;

        if ([ '/', '/api', '/api/directory' ].includes(href)) {
          url = '/api/directory';
        };

        await populateDirectoryListing(url);
      })
    })
  } catch (error) {
    console.error('Error fetching and updating directory listing:', error);
  }
}

export const handleContributionForm = () => {
  const formElements = document.querySelectorAll('.contribution-form');

  formElements.forEach(formElement => {
    formElement.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(formElement);
      try {
        const result = await submitContribution(formData);

        // window.location.href = `/directory/${result.recordPath}`;
      } catch (error) {
        console.error('Error:', error);
      }
    });
  })
}

export const handleQuestionForm = () => {
  const formElement = document.querySelector('.question-form');

  if (!formElement) return;

  formElement.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(formElement);

    try {
      await submitQuestion(formData);

      window.location.href = `/setup`;
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

export const hideTextareaContainer = (formElement) => {
  const textareaContainer = formElement.querySelector('.textarea-container');
  textareaContainer.classList.remove('active');
}

export const questionInteractions = () => {
  document.querySelectorAll('.contribution-form').forEach(formElement => {
    const textareaContainer = formElement.querySelector('.textarea-container');

    formElement.querySelector('label').addEventListener('click', () => {
      if (textareaContainer.classList.contains('active')) {
        hideTextareaContainer(formElement);
      } else {
        textareaContainer.classList.add('active');
      }
    })
  })
}

export const navigationInteractions = () => {
  const isDirectoryPage = location.href.includes('/directory');

  const activeClassname = 'active';

  const heading = document.querySelector('h1');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');

  if (isDirectoryPage) {
    heading.classList.remove(activeClassname);
    sections.forEach(navLink => navLink.classList.remove(activeClassname));
    navLinks.length > 1 && navLinks[1].classList.add(activeClassname);
    document.getElementById('listen').classList.add(activeClassname);
  }

  document.querySelectorAll('nav a').forEach(element => {
    element.addEventListener('click', e => {
      e.preventDefault();

      heading.classList.remove(activeClassname);
      navLinks.forEach(navLink => navLink.classList.remove(activeClassname));
      sections.forEach(navLink => navLink.classList.remove(activeClassname));

      const sectionId = element.getAttribute('href').replace('#', '');

      element.classList.add(activeClassname);
      sectionId && document.getElementById(sectionId).classList.add(activeClassname);

      // Update the URL
      window.history.pushState(null, null, `/#${sectionId}`);
    })
  })

  document.querySelector('h1 a').addEventListener('click', e => {
    navLinks.forEach(navLink => navLink.classList.remove(activeClassname));
    sections.forEach(navLink => navLink.classList.remove(activeClassname));
    heading.classList.add(activeClassname);
  })
}

export const handleQuestionItems = () => {
  const wrappperSelector = document.querySelector('#wrapper');

  const questionAnchorSelector = '.question-path';

  const questionSelector = '.question-item';

  const questionContainerSelector = '.questions';

  const cancelButtonSelector = 'button.cancel';

  const questionContainer = document.querySelector(questionContainerSelector);

  document.querySelectorAll(questionAnchorSelector).forEach(questionAnchor => {
    questionAnchor.addEventListener('mouseenter', () => {
      const questionId = questionAnchor.getAttribute('href').substring(1);

      const questionElement = document.getElementById(questionId);

      questionContainer.classList.add('preview');

      questionElement.classList.add('preview');

      wrappperSelector.classList.add('preview');
    })

    questionAnchor.addEventListener('mouseleave', () => {
      questionContainer.classList.remove('preview');
      wrappperSelector.classList.remove('preview');

      document.querySelectorAll(questionSelector).forEach(questionElement => {
        questionElement.classList.remove('preview');
      })
    })

    questionAnchor.addEventListener('click', () => {
      const questionId = questionAnchor.getAttribute('href').substring(1);

      const questionElement = document.getElementById(questionId);

      questionContainer.classList.add('active');
      questionElement.classList.add('active');
      wrappperSelector.classList.add('question-active');
      questionContainer.classList.remove('preview');
      questionElement.classList.remove('preview');
      wrappperSelector.classList.remove('preview');
    })

    document.querySelectorAll(cancelButtonSelector).forEach(buttonElement => {
      buttonElement.addEventListener('click', e => {
        e.preventDefault();

        questionContainer.classList.remove('preview');
        questionContainer.classList.remove('active');
        wrappperSelector.classList.remove('preview');
        wrappperSelector.classList.remove('question-active');

        document.querySelectorAll(questionSelector).forEach(questionElement => {
          questionElement.classList.remove('active');
          questionElement.classList.remove('preview');
        })
      });
    });
  })
}

export const handleHashNavigation = () => {
  const hash = location.hash;
  const sectionNames = [ 'listen', 'speak' ];

  if (hash && sectionNames.includes(hash.replace('#', ''))) {
    const sectionId = hash.replace('#', '');

    const activeClassname = 'active';

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    sections.forEach(navLink => navLink.classList.remove(activeClassname));
    navLinks.forEach(navLink => navLink.classList.remove(activeClassname));

    document.querySelector(`nav a[href="#${sectionId}"]`).classList.add(activeClassname);
    document.getElementById(sectionId).classList.add(activeClassname);

  }
}