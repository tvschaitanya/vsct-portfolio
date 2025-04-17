// Add your JavaScript here

// Set dark mode as default
window.darkMode = true;

const stickyClasses = ["fixed", "h-14"];
const unstickyClasses = ["absolute", "h-20"];
const stickyClassesContainer = [
	"border-neutral-300/50",
	"bg-white/80",
	"dark:border-neutral-600/40",
	"dark:bg-neutral-900/60",
	"backdrop-blur-2xl",
];
const unstickyClassesContainer = ["border-transparent"];

let headerElement = null;

document.addEventListener("DOMContentLoaded", () => {
	headerElement = document.getElementById("header");

	// Add duration class once
	document.documentElement.classList.add("duration-300");

	// Set dark mode as default unless user has explicitly chosen light mode
	const darkPref = localStorage.getItem("dark_mode");
	if (darkPref === null || darkPref === "true") {
		window.darkMode = true;
		showNight();
		document.documentElement.classList.add("dark");
	} else {
		showDay();
	}

	stickyHeaderFunctionality();
	applyMenuItemClasses();
	evaluateHeaderPosition();
	setupMobileMenu();
});

const stickyHeaderFunctionality = () => {
	window.addEventListener("scroll", evaluateHeaderPosition);
};

const evaluateHeaderPosition = () => {
	const menu = document.getElementById("menu");
	if (!headerElement || !menu) return;

	if (window.scrollY > 16) {
		headerElement.firstElementChild.classList.add(...stickyClassesContainer);
		headerElement.firstElementChild.classList.remove(...unstickyClassesContainer);
		headerElement.classList.add(...stickyClasses);
		headerElement.classList.remove(...unstickyClasses);
		menu.classList.add("top-[56px]");
		menu.classList.remove("top-[75px]");
	} else {
		headerElement.firstElementChild.classList.remove(...stickyClassesContainer);
		headerElement.firstElementChild.classList.add(...unstickyClassesContainer);
		headerElement.classList.add(...unstickyClasses);
		headerElement.classList.remove(...stickyClasses);
		menu.classList.remove("top-[56px]");
		menu.classList.add("top-[75px]");
	}
};

const showDay = (animate) => {
	const sun = document.getElementById("sun");
	const moon = document.getElementById("moon");
	const dayText = document.getElementById("dayText");
	const nightText = document.getElementById("nightText");

	if (!sun || !moon || !dayText || !nightText) return;

	sun.classList.remove("setting");
	moon.classList.remove("rising");

	let timeout = 0;
	if (animate) {
		timeout = 500;
		moon.classList.add("setting");
	}

	setTimeout(() => {
		dayText.classList.remove("hidden");
		nightText.classList.add("hidden");

		moon.classList.add("hidden");
		sun.classList.remove("hidden");

		if (animate) {
			document.documentElement.classList.remove("dark");
			sun.classList.add("rising");
		}
	}, timeout);
};

const showNight = (animate) => {
	const sun = document.getElementById("sun");
	const moon = document.getElementById("moon");
	const dayText = document.getElementById("dayText");
	const nightText = document.getElementById("nightText");

	if (!sun || !moon || !dayText || !nightText) return;

	moon.classList.remove("setting");
	sun.classList.remove("rising");

	let timeout = 0;
	if (animate) {
		timeout = 500;
		sun.classList.add("setting");
	}

	setTimeout(() => {
		nightText.classList.remove("hidden");
		dayText.classList.add("hidden");

		sun.classList.add("hidden");
		moon.classList.remove("hidden");

		if (animate) {
			document.documentElement.classList.add("dark");
			moon.classList.add("rising");
		}
	}, timeout);
};

document.getElementById("darkToggle")?.addEventListener("click", () => {
	if (document.documentElement.classList.contains("dark")) {
		localStorage.setItem("dark_mode", "false");
		showDay(true);
	} else {
		localStorage.setItem("dark_mode", "true");
		showNight(true);
	}
});

const applyMenuItemClasses = () => {
	const menuItems = document.querySelectorAll("#menu a");
	menuItems.forEach((item) => {
		if (item.pathname === window.location.pathname) {
			item.classList.add("text-neutral-900", "dark:text-white");
		}
	});
};

const setupMobileMenu = () => {
	const openBtn = document.getElementById("openMenu");
	const closeBtn = document.getElementById("closeMenu");
	const menu = document.getElementById("menu");
	const bg = document.getElementById("mobileMenuBackground");

	openBtn?.addEventListener("click", openMobileMenu);
	closeBtn?.addEventListener("click", closeMobileMenu);

	// Close mobile menu on menu item click
	const menuItems = document.querySelectorAll("#menu a");
	menuItems.forEach((item) => {
		item.addEventListener("click", closeMobileMenu);
	});
};

const openMobileMenu = () => {
	const openBtn = document.getElementById("openMenu");
	const closeBtn = document.getElementById("closeMenu");
	const menu = document.getElementById("menu");
	const bg = document.getElementById("mobileMenuBackground");

	if (!openBtn || !closeBtn || !menu || !bg) return;

	openBtn.classList.add("hidden");
	closeBtn.classList.remove("hidden");
	menu.classList.remove("hidden");
	bg.classList.add("opacity-0");
	bg.classList.remove("hidden");

	// Slight delay to allow CSS transition
	setTimeout(() => {
		bg.classList.remove("opacity-0");
	}, 1);
};

const closeMobileMenu = () => {
	const openBtn = document.getElementById("openMenu");
	const closeBtn = document.getElementById("closeMenu");
	const menu = document.getElementById("menu");
	const bg = document.getElementById("mobileMenuBackground");

	if (!openBtn || !closeBtn || !menu || !bg) return;

	closeBtn.classList.add("hidden");
	openBtn.classList.remove("hidden");
	menu.classList.add("hidden");
	bg.classList.add("hidden");
};
