models.register({
	name : 'Local',
	ICON : 'chrome://tombloo/skin/local.ico',
	
	check : function(ps){
		return (/(regular|photo|quote|link)/).test(ps.type);
	},
	
	post : function(ps){
		if(ps.type=='photo'){
			return this.Photo.post(ps);
		} else {
			return Local.append(getDataDir(ps.type + '.txt'), ps);
		}
	},
	
	append : function(file, ps){
		putContents(file, joinText([
			joinText([joinText(ps.tags, ' '), ps.item, ps.itemUrl, ps.body, ps.description], '\n\n', true), 
			getContents(file)
		], '\n\n\n'));
		
		return succeed();
	},
	
	Photo : {
		post : function(ps){
			var file = getDataDir('photo');
			createDir(file);
			
			if(ps.file){
				file.append(ps.file.leafName);
			} else {
				var uri = createURI(ps.itemUrl);
				var fileName = validateFileName(uri.fileName);
				file.append(fileName);
			}
			clearCollision(file);
			
			return succeed().addCallback(function(){
				if(ps.file){
					ps.file.copyTo(file.parent, file.leafName);
					return file;
				} else {
					return download(ps.itemUrl, file);
				}
			}).addCallback(function(file){
				if(AppInfo.OS == 'Darwin'){
					var script = getTempDir('setcomment.scpt');
					
					putContents(script, [
						'set aFile to POSIX file ("' + file.path + '" as Unicode text)',
						'set cmtStr to ("' + ps.pageUrl + '" as Unicode text)',
						'tell application "Finder" to set comment of (file aFile) to cmtStr'
					].join('\n'), 'UTF-16');
					
					var process = new Process(new LocalFile('/usr/bin/osascript'));
					process.run(false, [script.path], 1);
				}
			});
		},
	},
	
});
