document.addEventListener('DOMContentLoaded', function() {
  const terminalFlow = [
    {
      command: "npm init dianah-portfolio",
      output: `
        <span class="terminal-check">✔</span> Initialized package.json<br>
        <span class="terminal-check">✔</span> Installed dependencies<br>
        <span class="terminal-check">✔</span> Project ready at http://localhost:3000
      `,
      delayAfter: 2500
    },
    {
      command: "npm run deploy",
      output: '<span class="terminal-text">Deployment successful! Loading content...</span>',
      delayAfter: 2500
    },
    {
      command: "", // No command for the header info
      output: `
        <div class="terminal-header">
          <div class="terminal-title">DIANAH | LRC Artist + Programmer</div>
          <div class="terminal-subtitle">"From Lighting Art to Building Tools – Learning to Create Better Pipelines"</div>
          <div class="terminal-text">
            Lighting artist + pipeline coder. Turning workflow headaches into automated solutions. Wholeheartedly Love Cats! 
            I am currently working as a LRC Artist with various animation projects and also learning to be a Full Stack Developer.</div>
        </div>
        `,
      delayAfter: 0,
      animate: true // Flag to animate this output
    }
  ];

  const typingElement = document.getElementById('typing-text');
  const outputElement = document.getElementById('code-output');
  
  function runStep(step) {
    // Clear previous command and output
    typingElement.textContent = '';
    outputElement.innerHTML = '';
    
    // Only show command prompt if there's a command
    if (terminalFlow[step].command) {
      document.querySelector('.prompt').style.display = 'inline';
      typeCommand(terminalFlow[step].command, () => {
        showOutput(step);
      });
    } else {
      document.querySelector('.prompt').style.display = 'none';
      showOutput(step);
    }
  }

  function typeCommand(text, callback) {
    let i = 0;
    typingElement.textContent = '';
    
    function type() {
      if (i < text.length) {
        typingElement.textContent += text.charAt(i);
        i++;
        setTimeout(type, 50 + Math.random() * 50);
      } else {
        callback();
      }
    }
    
    type();
  }

  function showOutput(step) {
    setTimeout(() => {
      if (terminalFlow[step].animate) {
        // Animate the header info appearing
        animateHeaderInfo(terminalFlow[step].output);
      } else {
        // Show regular output immediately
        outputElement.innerHTML = terminalFlow[step].output;
      }
      
      // Move to next step if there are more steps
      if (step < terminalFlow.length - 1) {
        setTimeout(() => {
          runStep(step + 1);
        }, terminalFlow[step].delayAfter);
      } else {
        // Animation complete - keep cursor blinking
        document.querySelector('.cursor').style.animation = 'blink 1s infinite';
      }
    }, 500);
  }

  function animateHeaderInfo(content) {
    const headerLines = [
      '<div class="terminal-header">',
      '  <div class="terminal-title">DIANAH | LRC Artist + Programmer</div>',
      '  <div class="terminal-subtitle">"From Lighting Art to Pipeline Code – Bridging the Gap for Smoother Dev"</div>',
      '  <div class="terminal-text">',
      '    Lighting artist + pipeline coder. Turning workflow headaches into automated solutions. Wholeheartedly Love Cats!',
      '    I am currently working as a LRC Artist with various animation projects and also learning to be a Full Stack Developer.',
      '  </div>',
      '</div>'
    ];
    
    let currentLine = 0;
    outputElement.innerHTML = '';
    
    function typeNextLine() {
      if (currentLine < headerLines.length) {
        outputElement.innerHTML += headerLines[currentLine] + '\n';
        currentLine++;
        setTimeout(typeNextLine, 200); // Adjust speed here
      }
    }
    
    typeNextLine();
  }

  // Start the sequence after a brief delay
  setTimeout(() => runStep(0), 800);
});