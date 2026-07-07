export Herebyfile {
    readonly tasks: ReadonlyMap<string, Task>;
    readonly defaultTask: Task | undefined;
}

export async function loadHerebyfile(herebyfilePath: string): Promise<Herebyfile> {
    // Note: calling pathToFileURL is required on Windows to disambiguate URLs
    // from drive letters.
    const herebyfile = await import(pathToFileURL(herebyfilePath).toString());

    const exportedTasks = new Set<Task>();
    let defaultTask: Task | undefined;

    for (const [key, value] of Object.entries(herebyfile)) {
        if (!(value instanceof Task)) continue;

        if (key === "default") {
            defaultTask = value;
        } else if (exportedTasks.has(value)) {
            throw new UserError(`Task "${style.blue(value.options.name)}" has been exported twice.`);
        } else {
            exportedTasks.add(value);
        }
    }

    if (defaultTask) {
        exportedTasks.add(defaultTask);
    }

    if (exportedTasks.size === 0) {
        throw new UserError("No tasks found. Did you forget to export your tasks?");
    }

    // We check this here by walking the DAG, as some dependencies may not be
    // exported and therefore would not be seen by the above loop.
    checkTaskInvariants(exportedTasks);

    const tasks = new Map([...exportedTasks].map((task) => [task.options.name, task]));
