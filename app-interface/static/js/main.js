import {
  handleHashNavigation,
  handleQuestionForm,
  handleQuestionItems,
  navigationInteractions,
  populateDirectoryListing,
  questionInteractions
} from './interactions.js';

(async () => {
  let directoryApiEndpoint

  if (location.href.includes('/directory')) {
    const subfolders = location.href.substring(location.href.indexOf('/directory') + 10);
    directoryApiEndpoint = `/api/directory${subfolders}`;
  }

  handleHashNavigation();
  handleQuestionItems();
  handleQuestionForm();
  navigationInteractions();
  populateDirectoryListing(directoryApiEndpoint);
  questionInteractions();
})();
