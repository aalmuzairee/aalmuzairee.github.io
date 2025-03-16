const rawBibtexEntries = {
  "almuzairee2024recipe": 
  `@misc{almuzairee2024recipe,
    title={A Recipe for Unbounded Data Augmentation in Visual Reinforcement Learning}, 
    author={Abdulaziz Almuzairee and Nicklas Hansen and Henrik I. Christensen},
    year={2024},
    eprint={2405.17416},
    archivePrefix={arXiv},
    primaryClass={cs.LG},
    url={https://arxiv.org/abs/2405.17416}, 
  }`,
  "borse2023xalign": 
  `@inproceedings{borse2023xalign,
    title={X-Align: Cross-modal cross-view alignment for bird's-eye-view segmentation},
    author={Borse, Shubhankar and Klingner, Marvin and Kumar, Varun Ravi and Cai, Hong and Almuzairee, Abdulaziz and Yogamani, Senthil and Porikli, Fatih},
    booktitle={Proceedings of the IEEE/CVF Winter Conference on Applications of Computer Vision},
    pages={3287--3297},
    year={2023}
  }`
};

// Function to format BibTeX entries with consistent spacing
function formatBibTeX(bibtex) {
  // Split the BibTeX string into lines
  const lines = bibtex.trim().split('\n');
  
  // Get the first line (the @type{key, line)
  const firstLine = lines[0].trim();
  
  // Format the remaining fields with consistent indentation
  const formattedFields = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this is a field (contains =) or the closing brace
    if (line.includes('=')) {
      // This is a field, format it with consistent spacing
      const [field, value] = line.split('=').map(part => part.trim());
      // Add 2-space indentation and ensure proper spacing around equals sign
      // Remove trailing comma for proper handling
      const valuePart = value.endsWith(',') ? value : value + ',';
      formattedFields.push(`  ${field} = ${valuePart}`);
    } else if (line === '}' || line === '},') {
      // This is the closing brace, don't add indentation
      formattedFields.push('}');
    }
  }
  
  // Join the first line with the formatted fields
  return firstLine + '\n' + formattedFields.join('\n');
}

// Process all BibTeX entries for consistent formatting
const bibtexEntries = {};
for (const [key, value] of Object.entries(rawBibtexEntries)) {
  bibtexEntries[key] = formatBibTeX(value);
}

// Initialize the citation modal system when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("Citation script loaded");
  
  // Get the modal
  const modal = document.getElementById("citationModal");
  console.log("Modal element:", modal);
  
  if (!modal) {
    console.error("Modal element not found! Make sure the modal HTML is added to your page.");
    return;
  }

  // Ensure the modal is hidden initially
  modal.style.display = "none";
  
  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];
  
  // Get the pre element where the BibTeX will be displayed
  const bibtexContent = document.getElementById("bibtexContent");
  
  // Get the copy button
  const copyButton = document.getElementById("copyButton");
  
  // Get all citation links
  const citeLinks = document.getElementsByClassName("cite-link");
  console.log("Citation links found:", citeLinks.length);
  
  // When the user clicks on a citation link, open the modal with the corresponding BibTeX
  for (let i = 0; i < citeLinks.length; i++) {
    citeLinks[i].addEventListener('click', function(e) {
      e.preventDefault();
      const paperId = this.getAttribute("data-paper-id");
      console.log("Citation clicked for paper:", paperId);
      
      const bibtex = bibtexEntries[paperId];
      if (bibtex) {
        // Clear and update content first
        bibtexContent.textContent = bibtex;
        
        // Force a reflow before changing display property
        void modal.offsetWidth;
        
        // Show the modal
        modal.style.display = "block";
      } else {
        console.error("No BibTeX entry found for paper ID:", paperId);
      }
    });
  }
  
  // When the user clicks on <span> (x), close the modal
  if (span) {
    span.onclick = function() {
      modal.style.display = "none";
    };
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  
  // Copy to clipboard functionality
  if (copyButton) {
    copyButton.onclick = function() {
      const textToCopy = bibtexContent.textContent;
      navigator.clipboard.writeText(textToCopy).then(function() {
        const originalText = copyButton.textContent;
        copyButton.textContent = "Copied!";
        setTimeout(function() {
          copyButton.textContent = originalText;
        }, 2000);
      }).catch(function(err) {
        console.error('Could not copy text: ', err);
      });
    };
  }
});