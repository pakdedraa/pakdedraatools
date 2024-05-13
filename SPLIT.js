$(document).ready(function(){
    $("#splitTXT").click(function() {
        splitTXTFile();
    });

    function splitTXTFile() {
        var chunkSize = parseInt($("#chunkSize").val()); // Mengambil nilai dari input jumlah nomor setiap teks baru
        var startNumber = parseInt($("#startNumber").val()); // Mengambil nilai dari input nomor awal
        var fileNamePrefix = $("#fileNamePrefix").val(); // Mengambil nilai dari input awalan nama file baru
        var startFileNumber = parseInt($("#startFileNumber").val()); // Mengambil nilai dari input nomor awal file

        var files = $("#txtFile")[0].files; // Mengambil daftar file yang dipilih oleh pengguna

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function() {
                var numbers = this.result.split("\n");
                var currentStartNumber = startNumber; // Memastikan nilai startNumber tidak berubah saat membaca setiap file
                var header = numbers.slice(0, currentStartNumber); // Mengambil baris-baris sebelum nomor awal yang ditentukan
                var remainingNumbers = numbers.slice(currentStartNumber); // Sisa nomor-nomor setelah nomor awal yang ditentukan
                
                var lineNumber = currentStartNumber;
                var fileNumber = startFileNumber;
                for (var j = 0; j < remainingNumbers.length; j += chunkSize) {
                    var chunk = remainingNumbers.slice(j, j + chunkSize);
                    var newFileName = fileNamePrefix + ' ' + fileNumber + '.txt';
                    var newContent = header.concat(chunk).join("\n");
                    download(newFileName, newContent);
                    lineNumber += chunkSize;
                    fileNumber++;
                }
            }
        }
    }

    function download(filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    }
});
