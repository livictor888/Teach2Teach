/**
 * Create spinner from DOM
 */
function showSpinner() {
  const body = document.querySelector("body");
  const loading = document.createElement("div");
  loading.setAttribute("id", "spinner");
  loading.setAttribute(
    "style",
    "position: absolute; top: 0px; left: 0px; background-color: rgba(255, 255, 255, 0.70);"
  );
  loading.innerHTML = `  
    <div class="d-flex justify-content-center align-items-center" style="width: 100vw; height: 100vh;">
      <div class="spinner-border" style="width: 4rem; height: 4rem;" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  `;
  body.appendChild(loading);
}

/**
 * Remove spinner from DOM
 */
function removeSpinner() {
  const spinner = document.querySelector("#spinner");
  if (spinner) {
    spinner.remove();
  }
}

/**
 * Check if user loggedin or not
 * @returns User object if user loggedin, otherwise null or undefined
 */
const isUserLoggedIn = () =>
  new Promise((res) => {
    firebase.auth().onAuthStateChanged((user) => res(user));
  });

/**
 * Asynchronous call to fetch data from Firestore
 * @param {Objcet} db Firestore DB
 * @param {String} collection Name of collection
 * @param {String} docId Name of document id
 * @returns Promise with the data content from FB
 */
async function getDataFromDocAsync(db, collection, docId) {
  return new Promise((res) => {
    db.collection(collection)
      .doc(docId)
      .get()
      .then(res)
      .catch(() => res(undefined));
  });
}

/**
 * Convert Firestore timestamp to Javascript Date Object
 * @param {Firestore Timestamp} time
 * @returns Javascript Date Object
 */
function convertTimeFromFirebase(time) {
  if (!time) {
    return undefined;
  }

  return new Date(time.seconds * 1000);
}

/**
 * How long from the given time until now
 * @param {Firestore Timestamp} time
 * @returns How long from the given time until now
 */
function convertTimeFromThePast(time) {
  const dateInPast = time;
  if (!dateInPast) {
    return "";
  }

  const now = new Date();
  const delta = Math.abs(Math.floor((now - dateInPast) / 1000));

  if (delta > 365 * 24 * 60 * 60) {
    return `${Math.floor(delta / (365 * 24 * 60 * 60))} y`;
  } else if (delta > 7 * 24 * 60 * 60) {
    return `${Math.floor(delta / (7 * 24 * 60 * 60))} w`;
  } else if (delta > 24 * 60 * 60) {
    return `${Math.floor(delta / (24 * 60 * 60))} d`;
  } else if (delta > 60 * 60) {
    return `${Math.floor(delta / (60 * 60))} h`;
  } else if (delta > 60) {
    return `${Math.floor(delta / 60)} m`;
  } else {
    return `${delta} s`;
  }
}
