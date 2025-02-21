export function logoutUser() {
   
    const logoutOverlay = document.createElement("div");
    logoutOverlay.className =
      "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500";
    logoutOverlay.innerHTML = `
      <div class="bg-white p-6 rounded-lg shadow-lg text-center animate-fadeOut opacity-100 transition-all duration-700">
        <h2 class="text-xl font-semibold mb-3">👋 Logging Out...</h2>
        <p class="text-gray-600 mb-4">Your session has ended. Redirecting to login...</p>
        <div class="text-4xl animate-spin">🔄</div>
      </div>
    `;
  
    document.body.appendChild(logoutOverlay);
  
    document.cookie = "sessionToken=; Path=/; Max-Age=0;";
  
    setTimeout(() => {
      logoutOverlay.style.opacity = "0";
    }, 1500);
  
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }
  
