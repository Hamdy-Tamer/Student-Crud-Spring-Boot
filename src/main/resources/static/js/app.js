const API_URL = '/api/students';

/* ---------- State ---------- */
let students = [];
let pendingDeleteId = null;
let modalMode = 'add';   // 'add' | 'edit'

/* ---------- DOM refs ---------- */
const tableBody       = document.getElementById('studentsTableBody');
const emptyState      = document.getElementById('emptyState');
const studentCount    = document.getElementById('studentCount');
const searchInput     = document.getElementById('searchInput');
const refreshBtn      = document.getElementById('refreshBtn');
const addStudentBtn   = document.getElementById('addStudentBtn');
const deleteAllBtn    = document.getElementById('deleteAllBtn');

const studentModal    = new bootstrap.Modal('#studentModal');
const deleteModal     = new bootstrap.Modal('#deleteModal');
const deleteAllModal  = new bootstrap.Modal('#deleteAllModal');

const studentForm     = document.getElementById('studentForm');
const modalTitle      = document.getElementById('modalTitle');
const studentIdInput  = document.getElementById('studentId');
const nameInput       = document.getElementById('nameInput');
const emailInput      = document.getElementById('emailInput');
const dobInput        = document.getElementById('dobInput');
const formError       = document.getElementById('formError');
const saveBtn         = document.getElementById('saveBtn');

const deleteMessage     = document.getElementById('deleteMessage');
const confirmDeleteBtn  = document.getElementById('confirmDeleteBtn');
const confirmDeleteAllBtn = document.getElementById('confirmDeleteAllBtn');

/* 
   INIT
    */
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();

    refreshBtn.addEventListener('click', loadStudents);
    addStudentBtn.addEventListener('click', openAddModal);
    deleteAllBtn.addEventListener('click', openDeleteAllModal);
    confirmDeleteAllBtn.addEventListener('click', handleConfirmDeleteAll);
    searchInput.addEventListener('input', renderStudents);
    studentForm.addEventListener('submit', handleFormSubmit);
    confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
});

/* 
   API CALLS
    */

async function loadStudents() {
    setLoading(true);
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to load students');
        students = await res.json();
        renderStudents();
    } catch (err) {
        showToast('danger', 'Error', err.message);
        students = [];
        renderStudents();
    } finally {
        setLoading(false);
    }
}

async function createStudent(payload) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
}

async function updateStudent(id, payload) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return handleResponse(res);
}

async function deleteStudent(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return handleResponse(res);
}

async function deleteAllStudents() {
    const res = await fetch(API_URL, { method: 'DELETE' });
    return handleResponse(res);
}

/* Parse response & throw a friendly error if not OK */
async function handleResponse(res) {
    if (res.ok) {
        if (res.status === 204) return null;
        return res.json();
    }

    let payload = null;
    try { payload = await res.json(); } catch (_) { /* ignore */ }

    const err = new Error('Request failed');
    err.status = res.status;
    err.payload = payload;
    throw err;
}

/* 
   RENDERING
    */

function renderStudents() {
    const term = searchInput.value.trim().toLowerCase();

    const filtered = term
        ? students.filter(s =>
            s.name.toLowerCase().includes(term) ||
            s.email.toLowerCase().includes(term))
        : students;

    tableBody.innerHTML = '';

    // Disable "Delete All" when there's nothing to delete
    deleteAllBtn.disabled = students.length === 0;

    if (filtered.length === 0) {
        emptyState.classList.remove('d-none');
        studentCount.textContent = term
            ? `No matches for "${searchInput.value}"`
            : 'No students yet';
        return;
    }

    emptyState.classList.add('d-none');
    studentCount.textContent = `${students.length} student${students.length !== 1 ? 's' : ''} total`;

    filtered.forEach(s => {
        const tr = document.createElement('tr');
        tr.className = 'student-row';
        tr.innerHTML = `
            <td class="text-muted">${s.id}</td>
            <td class="fw-medium">${escapeHtml(s.name)}</td>
            <td class="text-muted">${escapeHtml(s.email)}</td>
            <td>${genderPill(s.gender)}</td>
            <td>${formatDate(s.dob)}</td>
            <td class="text-center">${s.age}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary btn-icon-only me-1"
                        title="Edit"
                        onclick="openEditModal(${s.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-icon-only"
                        title="Delete"
                        onclick="openDeleteModal(${s.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function genderPill(gender) {
    if (gender === 'MALE') {
        return `<span class="gender-pill male">
                    <i class="fa-solid fa-mars"></i> Male
                </span>`;
    }
    if (gender === 'FEMALE') {
        return `<span class="gender-pill female">
                    <i class="fa-solid fa-venus"></i> Female
                </span>`;
    }
    return `<span class="text-muted">—</span>`;
}

function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
}

function setLoading(isLoading) {
    if (isLoading) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-muted">
                    <div class="spinner-border spinner-border-sm me-2"></div>
                    Loading students...
                </td>
            </tr>`;
        emptyState.classList.add('d-none');
    }
}

/* 
   MODAL — ADD / EDIT
    */

function openAddModal() {
    modalMode = 'add';
    modalTitle.innerHTML = '<i class="fa-solid fa-user-plus me-2"></i>Add Student';

    studentForm.reset();
    studentIdInput.value = '';
    clearFormErrors();
    formError.classList.add('d-none');

    studentModal.show();
}

window.openEditModal = function (id) {
    const s = students.find(x => x.id === id);
    if (!s) return;

    modalMode = 'edit';
    modalTitle.innerHTML = '<i class="fa-solid fa-user-pen me-2"></i>Edit Student';

    studentIdInput.value = s.id;
    nameInput.value  = s.name;
    emailInput.value = s.email;
    dobInput.value   = s.dob;

    const radio = document.querySelector(`input[name="gender"][value="${s.gender}"]`);
    if (radio) radio.checked = true;

    clearFormErrors();
    formError.classList.add('d-none');

    studentModal.show();
};

async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
        name:   nameInput.value.trim(),
        email:  emailInput.value.trim(),
        dob:    dobInput.value,
        gender: document.querySelector('input[name="gender"]:checked')?.value
    };

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Saving...';

    try {
        if (modalMode === 'add') {
            await createStudent(payload);
            showToast('success', 'Created', `${payload.name} was added.`);
        } else {
            const id = studentIdInput.value;
            await updateStudent(id, payload);
            showToast('success', 'Updated', `${payload.name} was updated.`);
        }

        studentModal.hide();
        await loadStudents();

    } catch (err) {
        handleApiError(err);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-solid fa-floppy-disk me-1"></i>Save';
    }
}

/* Map backend errors to the form */
function handleApiError(err) {
    clearFormErrors();

    const payload = err.payload;

    // Bean Validation errors: { fieldErrors: { name: "...", email: "..." } }
    if (payload && payload.fieldErrors) {
        Object.entries(payload.fieldErrors).forEach(([field, msg]) => {
            const input = document.getElementById(`${field}Input`);
            if (input) {
                input.classList.add('is-invalid');
                const feedback = document.getElementById(`${field}Error`);
                if (feedback) feedback.textContent = msg;
            } else if (field === 'gender') {
                const gErr = document.getElementById('genderError');
                if (gErr) gErr.textContent = msg;
            }
        });
        formError.textContent = 'Please fix the errors above.';
        formError.classList.remove('d-none');
        return;
    }

    // Simple message from backend: { message: "Email is taken" }
    const msg = payload?.message || err.message || 'Something went wrong';
    formError.textContent = msg;
    formError.classList.remove('d-none');
}

/* 
   MODAL — DELETE ONE
    */

window.openDeleteModal = function (id) {
    const s = students.find(x => x.id === id);
    if (!s) return;

    pendingDeleteId = id;
    deleteMessage.innerHTML =
        `Delete <strong>${escapeHtml(s.name)}</strong>?<br>
         <small class="text-muted">This action cannot be undone.</small>`;

    deleteModal.show();
};

async function handleConfirmDelete() {
    if (!pendingDeleteId) return;

    confirmDeleteBtn.disabled = true;
    confirmDeleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Deleting...';

    try {
        await deleteStudent(pendingDeleteId);
        showToast('success', 'Deleted', 'Student removed.');
        deleteModal.hide();
        await loadStudents();
    } catch (err) {
        showToast('danger', 'Delete failed',
                  err.payload?.message || err.message);
    } finally {
        confirmDeleteBtn.disabled = false;
        confirmDeleteBtn.innerHTML = '<i class="fa-solid fa-trash me-1"></i>Delete';
        pendingDeleteId = null;
    }
}

/* 
   MODAL — DELETE ALL
    */

function openDeleteAllModal() {
    if (students.length === 0) {
        showToast('info', 'Nothing to delete', 'There are no students.');
        return;
    }
    deleteAllModal.show();
}

async function handleConfirmDeleteAll() {
    const count = students.length;

    confirmDeleteAllBtn.disabled = true;
    confirmDeleteAllBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-1"></span>Deleting...';

    try {
        await deleteAllStudents();
        showToast('success', 'Deleted',
                  `All ${count} student${count !== 1 ? 's' : ''} removed.`);
        deleteAllModal.hide();
        await loadStudents();
    } catch (err) {
        showToast('danger', 'Delete failed',
                  err.payload?.message || err.message);
    } finally {
        confirmDeleteAllBtn.disabled = false;
        confirmDeleteAllBtn.innerHTML =
            '<i class="fa-solid fa-trash-can me-1"></i>Delete All';
    }
}

/* 
   VALIDATION (mirrors the backend)
    */

const NAME_REGEX  = /^(?=^.{3,15}$)[A-Z][a-z]*(\s[A-Z][a-z]*)*$/;
const EMAIL_REGEX = /^[a-zA-Z._%+-]+[0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,3}$/;

function validateForm() {
    clearFormErrors();
    let ok = true;

    // Name
    if (!nameInput.value.trim()) {
        setFieldError('name', 'Name is required');
        ok = false;
    } else if (!NAME_REGEX.test(nameInput.value.trim())) {
        setFieldError('name', 'Name must start with a capital letter, be 3–15 chars, letters only');
        ok = false;
    }

    // Email
    if (!emailInput.value.trim()) {
        setFieldError('email', 'Email is required');
        ok = false;
    } else if (!EMAIL_REGEX.test(emailInput.value.trim())) {
        setFieldError('email', 'Invalid email format');
        ok = false;
    }

    // DOB
    if (!dobInput.value) {
        setFieldError('dob', 'Date of birth is required');
        ok = false;
    } else if (new Date(dobInput.value) >= new Date()) {
        setFieldError('dob', 'Date of birth must be in the past');
        ok = false;
    }

    // Gender
    if (!document.querySelector('input[name="gender"]:checked')) {
        document.getElementById('genderError').textContent = 'Gender is required';
        ok = false;
    }

    return ok;
}

function setFieldError(field, msg) {
    const input = document.getElementById(`${field}Input`);
    const feedback = document.getElementById(`${field}Error`);
    if (input) input.classList.add('is-invalid');
    if (feedback) feedback.textContent = msg;
}

function clearFormErrors() {
    ['name', 'email', 'dob'].forEach(f => {
        const input = document.getElementById(`${f}Input`);
        const feedback = document.getElementById(`${f}Error`);
        if (input) input.classList.remove('is-invalid');
        if (feedback) feedback.textContent = '';
    });
    document.getElementById('genderError').textContent = '';
}

/* 
   TOASTS
    */

function showToast(type, title, message) {
    const icons = {
        success: 'fa-circle-check',
        danger:  'fa-circle-exclamation',
        warning: 'fa-triangle-exclamation',
        info:    'fa-circle-info'
    };

    const container = document.getElementById('toastContainer');
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-bg-${type} border-0 mb-2`;
    toastEl.setAttribute('role', 'alert');
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="fa-solid ${icons[type] || icons.info} me-2"></i>
                <strong>${escapeHtml(title)}</strong> — ${escapeHtml(message)}
            </div>
            <button type="button"
                    class="btn-close btn-close-white me-2 m-auto"
                    data-bs-dismiss="toast"></button>
        </div>
    `;
    container.appendChild(toastEl);

    const t = new bootstrap.Toast(toastEl, { delay: 3500 });
    t.show();

    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

/* 
   HELPERS
    */

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}