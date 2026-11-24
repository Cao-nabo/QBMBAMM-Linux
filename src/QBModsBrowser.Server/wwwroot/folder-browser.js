// Linux fork addition: server-filesystem folder picker. A browser-hosted UI has no access to a
// native OS file dialog, so this browses the server's filesystem one directory at a time via
// /api/manager/browse-folders and lets the user pick a folder instead of free-typing a path.
function buildFolderBrowserMethods() {
    return {
        // Opens the picker and seeds it at the current value of the given managerConfig field.
        async openFolderBrowser(targetField) {
            this.folderBrowser.targetField = targetField;
            this.folderBrowser.error = '';
            this.folderBrowser.open = true;
            await this.browseFolderPath(this.managerConfig[targetField] || '');
        },

        closeFolderBrowser() {
            this.folderBrowser.open = false;
        },

        // Fetches the listing for a path (or the server's best-guess starting point if blank/invalid).
        async browseFolderPath(path) {
            try {
                const qs = path ? `?path=${encodeURIComponent(path)}` : '';
                const res = await fetch(`/api/manager/browse-folders${qs}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                this.folderBrowser.path = data.path;
                this.folderBrowser.parent = data.parent;
                this.folderBrowser.folders = data.folders;
                this.folderBrowser.shortcuts = data.shortcuts;
                this.folderBrowser.error = '';
            } catch (e) {
                this.folderBrowser.error = 'Could not read that folder.';
            }
        },

        // Writes the currently-browsed path into the target field and closes the picker.
        selectFolderBrowserResult() {
            if (!this.folderBrowser.targetField) return;
            this.managerConfig[this.folderBrowser.targetField] = this.folderBrowser.path;
            this.setupPathError = '';
            this.folderBrowser.open = false;
        },

        // Fetches the folder-browser.html partial and injects it into the mount point.
        async loadFolderBrowserTemplate() {
            const mount = this.$refs.folderBrowserMount;
            if (!mount) return;
            try {
                const res = await fetch('/folder-browser.html', { cache: 'no-store' });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                mount.innerHTML = await res.text();
                if (window.Alpine?.initTree) {
                    window.Alpine.initTree(mount);
                }
            } catch (e) {
                console.error('Failed to load folder browser template:', e);
            }
        }
    };
}
