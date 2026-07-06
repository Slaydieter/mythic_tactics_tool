import { useState, useEffect, useMemo, useRef } from "react";

/* ============ DỮ LIỆU (tự sinh từ Mythic_tactics_v2.txt) ============ */
const UNITS = [{"n":"ANUBIS","t":"NILES","c":6,"sum":false,"s":[[4,4],[8,8],[16,16]],"k":["Sau khi 1 đồng minh chết → cho đồng minh thấp máu nhất \"TÁI SINH\" (1 lần trong chiến đấu)","Sau khi 1 đồng minh chết → cho đồng minh thấp máu nhất \"TÁI SINH\" (2 lần trong chiến đấu)","Sau khi 1 đồng minh chết → cho đồng minh thấp máu nhất \"TÁI SINH\" (3 lần trong chiến đấu)"],"id":0,"tags":["TAISINH"],"kw":[],"fx":[[],[],[]]},{"n":"SEKHMET","t":"NILES","c":6,"sum":false,"s":[[9,3],[18,6],[36,12]],"k":["Sau khi 1 đồng minh được triệu hồi trong chiến đấu → phá hủy nó. (2 lần trong chiến đấu). TỬ VONG: Triệu hồi bản sao nguyên bản của những đồng minh đã hấp thụ.","Sau khi 1 đồng minh được triệu hồi trong chiến đấu → phá hủy nó. (4 lần trong chiến đấu). TỬ VONG: Triệu hồi bản sao nguyên bản của những đồng minh đã hấp thụ.","Sau khi 1 đồng minh được triệu hồi trong chiến đấu → phá hủy nó. (6 lần trong chiến đấu). TỬ VONG: Triệu hồi bản sao nguyên bản của những đồng minh đã hấp thụ."],"id":1,"tags":["TRIEUHOI"],"kw":[],"fx":[[],[],[]]},{"n":"OSIRIS","t":"NILES","c":6,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["Sau khi 1 đồng minh \"TÁI SINH\", cho nó chỉ số của OSIRIS","Sau khi 1 đồng minh \"TÁI SINH\", cho nó gấp đôi chỉ số của OSIRIS","Sau khi 1 đồng minh \"TÁI SINH\", cho nó gấp ba chỉ số của OSIRIS"],"id":2,"tags":["TAISINH"],"kw":[],"fx":[[],[],[]]},{"n":"SOBEK","t":"NILES","c":5,"sum":false,"s":[[1,1],[2,2],[4,4]],"k":["Sobek nhận +1/+1 cho mỗi đồng minh NILES được triệu hồi trong trận (bất kể đơn vị này ở đâu).","Sobek nhận +2/+2 cho mỗi đồng minh NILES được triệu hồi trong trận (bất kể đơn vị này ở đâu).","Sobek nhận +4/+4 cho mỗi đồng minh NILES được triệu hồi trong trận (bất kể đơn vị này ở đâu)."],"id":3,"tags":["TRIEUHOI"],"kw":[],"fx":[[{"tr":"SUMM","a":1,"h":1,"lim":0,"tg":"self"}],[{"tr":"SUMM","a":2,"h":2,"lim":0,"tg":"self"}],[{"tr":"SUMM","a":4,"h":4,"lim":0,"tg":"self"}]]},{"n":"BASTET","t":"NILES","c":5,"sum":false,"s":[[4,8],[8,16],[16,32]],"k":["Sau khi triệu hồi 3 đồng minh trong chiến đấu. Đồng minh NILES nhận +1/+1 lượt này. (Tăng thêm +1/+1 mỗi lần kích hoạt)","Sau khi triệu hồi 3 đồng minh trong chiến đấu. Đồng minh NILES nhận +1/+1 lượt này. (Tăng thêm +2/+2 mỗi lần kích hoạt)","Sau khi triệu hồi 3 đồng minh trong chiến đấu. Đồng minh NILES nhận +1/+1 lượt này. (Tăng thêm +4/+4 mỗi lần kích hoạt)"],"id":4,"tags":["TRIEUHOI"],"kw":[],"fx":[[{"tr":"SUMM","a":1,"h":1,"lim":0,"tg":"self"}],[{"tr":"SUMM","a":1,"h":1,"lim":0,"tg":"self"}],[{"tr":"SUMM","a":1,"h":1,"lim":0,"tg":"self"}]]},{"n":"THOTH","t":"NILES","c":5,"sum":false,"s":[[7,5],[14,10],[28,20]],"k":["\"TÁI SINH\"-\"TỬ VONG\": Đồng minh NILES được +2 sát thương lượt này (bất kể ở đâu).","\"TÁI SINH\"-\"TỬ VONG\": Đồng minh NILES được +4 sát thương lượt này (bất kể ở đâu).","\"TÁI SINH\"-\"TỬ VONG\": Đồng minh NILES được +8 sát thương lượt này (bất kể ở đâu)."],"id":5,"tags":["TAISINH"],"kw":[],"fx":[[],[],[]]},{"n":"ISIS","t":"NILES","c":5,"sum":false,"s":[[2,9],[4,18],[8,36]],"k":["Sau khi 1 đồng minh \"TÁI SINH\", cho tất cả đồng minh nhận +3/+3 \"VĨNH VIỄN\".","Sau khi 1 đồng minh \"TÁI SINH\", cho tất cả đồng minh nhận +6/+6 \"VĨNH VIỄN\".","Sau khi 1 đồng minh \"TÁI SINH\", cho tất cả đồng minh nhận +12/+12 \"VĨNH VIỄN\"."],"id":6,"tags":["TAISINH"],"kw":[],"fx":[[{"tr":"REB","a":3,"h":3,"lim":0,"tg":"self"}],[{"tr":"REB","a":6,"h":6,"lim":0,"tg":"self"}],[{"tr":"REB","a":12,"h":12,"lim":0,"tg":"self"}]]},{"n":"SEPOPARD","t":"NILES","c":4,"sum":false,"s":[[5,2],[10,4],[20,8]],"k":["Bất cứ khi nào triệu hồi 1 đồng minh trong chiến đấu, cho nó +4/+4.","Bất cứ khi nào triệu hồi 1 đồng minh trong chiến đấu, cho nó +8/+8.","Bất cứ khi nào triệu hồi 1 đồng minh trong chiến đấu, cho nó +16/+16."],"id":7,"tags":["TRIEUHOI"],"kw":[],"fx":[[{"tr":"SUMM","a":4,"h":4,"lim":0,"tg":"ally"}],[{"tr":"SUMM","a":8,"h":8,"lim":0,"tg":"ally"}],[{"tr":"SUMM","a":16,"h":16,"lim":0,"tg":"ally"}]]},{"n":"NEFERTEM","t":"NILES","c":4,"sum":false,"s":[[4,2],[8,4],[16,8]],"k":["\"TỬ VONG\": Cho 1 đồng minh NILES khác \"TÁI SINH\".","\"TỬ VONG\": Cho 2 đồng minh NILES khác \"TÁI SINH\".","\"TỬ VONG\": Cho 3 đồng minh NILES khác \"TÁI SINH\"."],"id":8,"tags":["TAISINH"],"kw":[],"fx":[[],[],[]]},{"n":"SA TINH","t":"NILES","c":4,"sum":false,"s":[[6,2],[12,4],[24,8]],"k":["\"TỬ VONG\": Triệu hồi 1 \"Chiến binh NILES\".","\"TỬ VONG\": Triệu hồi 2 \"Chiến binh NILES\".","\"TỬ VONG\": Triệu hồi 3 \"Chiến binh NILES\"."],"id":9,"tags":["TRIEUHOI"],"kw":[],"fx":[[],[],[]]},{"n":"UPAMAKI","t":"NILES","c":4,"sum":false,"s":[[5,3],[10,6],[20,12]],"k":["\"TRIỂN KHAI\": Chọn 1 đồng minh NILES khác để tiêu diệt. \"TỬ VONG\": Triệu hồi bản sao gốc của đồng minh đó.","\"TRIỂN KHAI\": Chọn 1 đồng minh NILES khác để tiêu diệt. \"TỬ VONG\": Triệu hồi bản sao gốc +4/+4 của đồng minh đó.","\"TRIỂN KHAI\": Chọn 1 đồng minh NILES khác để tiêu diệt. \"TỬ VONG\": Triệu hồi bản sao gốc +8/+8 của đồng minh đó."],"id":10,"tags":["TRIEUHOI"],"kw":[],"fx":[[],[{"tr":"SHOP","a":4,"h":4,"lim":0,"tg":"ally"}],[{"tr":"SHOP","a":8,"h":8,"lim":0,"tg":"ally"}]]},{"n":"MIÊU CUNG THỦ","t":"NILES","c":3,"sum":false,"s":[[3,1],[6,2],[12,4]],"k":["\"TẦM XA\"-\"KHAI TRẬN\": Kích hoạt hiệu ứng \"TỬ VONG\" của đồng minh cùng cột 1 lần.","\"TẦM XA\"-\"KHAI TRẬN\": Kích hoạt hiệu ứng \"TỬ VONG\" của đồng minh cùng cột 2 lần.","\"TẦM XA\"-\"KHAI TRẬN\": Kích hoạt hiệu ứng \"TỬ VONG\" của đồng minh cùng cột 3 lần."],"id":11,"tags":[],"kw":["TẦM XA"],"fx":[[],[],[]]},{"n":"KẺ TÀ GIÁO","t":"NILES","c":3,"sum":false,"s":[[3,1],[6,2],[12,4]],"k":["Sau khi 3 đồng minh bị kết liễu, đồng minh NILES có +1 sát thương lượt này (bất kể ở đâu).","Sau khi 3 đồng minh bị kết liễu, đồng minh NILES có +2 sát thương lượt này (bất kể ở đâu).","Sau khi 3 đồng minh bị kết liễu, đồng minh NILES có +4 sát thương lượt này (bất kể ở đâu)."],"id":12,"tags":["KETLIEU"],"kw":[],"fx":[[{"tr":"OTHER","a":1,"h":0,"lim":0,"tg":"ally"}],[{"tr":"OTHER","a":2,"h":0,"lim":0,"tg":"ally"}],[{"tr":"OTHER","a":4,"h":0,"lim":0,"tg":"ally"}]]},{"n":"BỌ CẠP","t":"NILES","c":3,"sum":false,"s":[[1,1],[2,2],[4,4]],"k":["\"HIỂM ĐỘC\": Hủy diệt đơn vị đầu tiên bị gây sát thương.","\"HIỂM ĐỘC\": Hủy diệt đơn vị đầu tiên bị gây sát thương.","\"HIỂM ĐỘC\": Hủy diệt đơn vị đầu tiên bị gây sát thương."],"id":13,"tags":[],"kw":["HIỂM ĐỘC"],"fx":[[],[],[]]},{"n":"AMMIT","t":"NILES","c":3,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["Sau khi 1 đồng minh NILES chết → nhận +1/+1 \"VĨNH VIỄN\".","Sau khi 1 đồng minh NILES chết → nhận +2/+2 \"VĨNH VIỄN\".","Sau khi 1 đồng minh NILES chết → nhận +4/+4 \"VĨNH VIỄN\"."],"id":14,"tags":[],"kw":[],"fx":[[{"tr":"DIE","a":1,"h":1,"lim":0,"tg":"self"}],[{"tr":"DIE","a":2,"h":2,"lim":0,"tg":"self"}],[{"tr":"DIE","a":4,"h":4,"lim":0,"tg":"self"}]]},{"n":"LINH CẨU ĐẠO TẶC","t":"NILES","c":2,"sum":false,"s":[[3,1],[6,2],[12,4]],"k":["\"TRIỂN KHAI\": Nhận 1 phép thánh đền \"Đồng vàng cổ\".","\"TRIỂN KHAI\": Nhận 2 phép thánh đền \"Đồng vàng cổ\".","\"TRIỂN KHAI\": Nhận 3 phép thánh đền \"Đồng vàng cổ\"."],"id":15,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"BABI","t":"NILES","c":2,"sum":false,"s":[[1,1],[2,2],[4,4]],"k":["\"TÁI SINH\": Đơn vị này nhận +1 sát thương cho mỗi lần \"BABI\" chết trong trận (bất kể đơn vị này ở đâu).","\"TÁI SINH\": Đơn vị này nhận +2 sát thương cho mỗi lần \"BABI\" chết trong trận (bất kể đơn vị này ở đâu).","\"TÁI SINH\": Đơn vị này nhận +4 sát thương cho mỗi lần \"BABI\" chết trong trận (bất kể đơn vị này ở đâu)."],"id":16,"tags":["TAISINH"],"kw":[],"fx":[[{"tr":"REB","a":1,"h":0,"lim":0,"tg":"self"}],[{"tr":"REB","a":2,"h":0,"lim":0,"tg":"self"}],[{"tr":"REB","a":4,"h":0,"lim":0,"tg":"self"}]]},{"n":"ĐẠI TƯỚNG NILES","t":"NILES","c":2,"sum":false,"s":[[4,4],[8,8],[16,16]],"k":["Bất cứ khi nào triệu hồi 1 đồng minh → nhận +1/+1.","Bất cứ khi nào triệu hồi 1 đồng minh → nhận +2/+2.","Bất cứ khi nào triệu hồi 1 đồng minh → nhận +4/+4."],"id":17,"tags":["TRIEUHOI"],"kw":[],"fx":[[{"tr":"SUMM","a":1,"h":1,"lim":0,"tg":"self"}],[{"tr":"SUMM","a":2,"h":2,"lim":0,"tg":"self"}],[{"tr":"SUMM","a":4,"h":4,"lim":0,"tg":"self"}]]},{"n":"TAWARET","t":"NILES","c":2,"sum":false,"s":[[0,1],[0,2],[0,4]],"k":["\"TỬ VONG\": Triệu hồi 1 \"Medjed Đen\" và 1 \"Medjed Trắng\", cho chúng +1/+1.","\"TỬ VONG\": Triệu hồi 1 \"Medjed Đen\" và 1 \"Medjed Trắng\", cho chúng +2/+2.","\"TỬ VONG\": Triệu hồi 1 \"Medjed Đen\" và 1 \"Medjed Trắng\", cho chúng +4/+4."],"id":18,"tags":["TRIEUHOI"],"kw":[],"fx":[[],[],[]]},{"n":"CHIẾN BINH NILES","t":"NILES","c":1,"sum":false,"s":[[2,1],[4,2],[8,4]],"k":["\"TỬ VONG\": Triệu hồi 1 \"XÁC ƯỚP\".","\"TỬ VONG\": Triệu hồi 2 \"XÁC ƯỚP\".","\"TỬ VONG\": Triệu hồi 3 \"XÁC ƯỚP\"."],"id":19,"tags":["TRIEUHOI"],"kw":[],"fx":[[],[],[]]},{"n":"GRIFFIN","t":"NILES","c":1,"sum":false,"s":[[2,1],[4,2],[8,4]],"k":["\"KHIÊU KHÍCH\"-\"TÁI SINH\"","\"KHIÊU KHÍCH\"-\"TÁI SINH\": Sau khi được \"TÁI SINH\" nhận +2/+2","\"KHIÊU KHÍCH\"-\"TÁI SINH\": Sau khi được \"TÁI SINH\" nhận +4/+6"],"id":20,"tags":["TAISINH"],"kw":["KHIÊU KHÍCH"],"fx":[[],[{"tr":"REB","a":2,"h":2,"lim":0,"tg":"self"}],[{"tr":"REB","a":4,"h":6,"lim":0,"tg":"self"}]]},{"n":"MEDJED ĐEN","t":"NILES","c":0,"sum":true,"s":[[2,1],[4,2],[8,4]],"k":["KHIÊU KHÍCH.","KHIÊU KHÍCH.","KHIÊU KHÍCH."],"id":21,"tags":[],"kw":["KHIÊU KHÍCH"],"fx":[[],[],[]]},{"n":"MEDJED TRẮNG","t":"NILES","c":0,"sum":true,"s":[[2,1],[4,2],[8,4]],"k":["KHIÊU KHÍCH.","KHIÊU KHÍCH.","KHIÊU KHÍCH."],"id":22,"tags":[],"kw":["KHIÊU KHÍCH"],"fx":[[],[],[]]},{"n":"XÁC ƯỚP","t":"NILES","c":0,"sum":true,"s":[[1,1],[2,2],[4,4]],"k":["—","—","—"],"id":23,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"ARES","t":"OLYMPUS","c":6,"sum":false,"s":[[8,6],[16,12],[32,24]],"k":["\"TẤN CÔNG\": Cho 1 đồng minh ngẫu nhiên khác ×1 sát thương của \"ARES\" và \"LÁ CHẮN\".","\"TẤN CÔNG\": Cho 1 đồng minh ngẫu nhiên khác ×2 sát thương của \"ARES\" và \"LÁ CHẮN\".","\"TẤN CÔNG\": Cho 1 đồng minh ngẫu nhiên khác ×3 sát thương của \"ARES\" và \"LÁ CHẮN\"."],"id":24,"tags":["LACHAN"],"kw":["LÁ CHẮN"],"fx":[[],[],[]]},{"n":"APOLO","t":"OLYMPUS","c":6,"sum":false,"s":[[6,6],[12,12],[24,24]],"k":["Khi 1 đồng minh nhận \"LÁ CHẮN\" → lập tức tấn công và ĐỐT(6) mục tiêu. (1 lần trong chiến đấu)","Khi 1 đồng minh nhận \"LÁ CHẮN\" → lập tức tấn công và ĐỐT(6) mục tiêu. (3 lần trong chiến đấu)","Khi 1 đồng minh nhận \"LÁ CHẮN\" → lập tức tấn công và ĐỐT(6) mục tiêu. (999 lần trong chiến đấu)"],"id":25,"tags":["LACHAN","DOT"],"kw":["LÁ CHẮN","ĐỐT"],"fx":[[],[],[]]},{"n":"ATHENA","t":"OLYMPUS","c":6,"sum":false,"s":[[6,12],[12,24],[24,48]],"k":["Sau khi 1 đồng minh nhận LÁ CHẮN → tất cả đồng minh nhận +2/+2 và đồng minh đó tấn công ngay lập tức. (2 lần trong chiến đấu)","Sau khi 1 đồng minh nhận LÁ CHẮN → tất cả đồng minh nhận +4/+4 và đồng minh đó tấn công ngay lập tức. (3 lần trong chiến đấu)","Sau khi 1 đồng minh nhận LÁ CHẮN → tất cả đồng minh nhận +8/+8 và đồng minh đó tấn công ngay lập tức. (999 lần trong chiến đấu)"],"id":26,"tags":["LACHAN"],"kw":["LÁ CHẮN"],"fx":[[{"tr":"ATK","a":2,"h":2,"lim":2,"tg":"self"}],[{"tr":"ATK","a":4,"h":4,"lim":3,"tg":"self"}],[{"tr":"ATK","a":8,"h":8,"lim":999,"tg":"self"}]]},{"n":"HECATE","t":"OLYMPUS","c":5,"sum":false,"s":[[3,7],[6,14],[12,28]],"k":["Mỗi khi sử dụng \"PHÉP THÁNH ĐỀN\" → đồng minh Olympus nhận +2/+1","Mỗi khi sử dụng \"PHÉP THÁNH ĐỀN\" → đồng minh Olympus nhận +4/+2","Mỗi khi sử dụng \"PHÉP THÁNH ĐỀN\" → đồng minh Olympus nhận +8/+4"],"id":27,"tags":["PHEP"],"kw":[],"fx":[[{"tr":"OTHER","a":2,"h":1,"lim":0,"tg":"self"}],[{"tr":"OTHER","a":4,"h":2,"lim":0,"tg":"self"}],[{"tr":"OTHER","a":8,"h":4,"lim":0,"tg":"self"}]]},{"n":"MEDUSA","t":"OLYMPUS","c":5,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["\"TẤN CÔNG\": Biến chỉ số mục tiêu thành 1/1. (1 lần trong chiến đấu)","\"TẤN CÔNG\": Biến chỉ số mục tiêu thành 1/1. (2 lần trong chiến đấu)","\"TẤN CÔNG\": Biến chỉ số mục tiêu thành 1/1. (3 lần trong chiến đấu)"],"id":28,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"TYPHON","t":"OLYMPUS","c":5,"sum":false,"s":[[9,9],[18,18],[36,36]],"k":["\"TẤN CÔNG\": ĐỐT(6) mục tiêu và tất cả kẻ địch.","\"TẤN CÔNG\": ĐỐT(12) mục tiêu và tất cả kẻ địch.","\"TẤN CÔNG\": ĐỐT(18) mục tiêu và tất cả kẻ địch."],"id":29,"tags":["DOT"],"kw":["ĐỐT"],"fx":[[],[],[]]},{"n":"ARTEMIS","t":"OLYMPUS","c":5,"sum":false,"s":[[8,3],[16,6],[32,12]],"k":["\"TẦM XA\": Luôn tấn công kẻ địch thấp máu nhất. \"KẾT LIỄU(1)\": Cho 1 đồng minh Olympus khác \"LÁ CHẮN\".","\"TẦM XA\": Luôn tấn công kẻ địch thấp máu nhất. \"KẾT LIỄU(1)\": Cho 2 đồng minh Olympus khác \"LÁ CHẮN\".","\"TẦM XA\": Luôn tấn công kẻ địch thấp máu nhất. \"KẾT LIỄU(1)\": Cho 4 đồng minh Olympus khác \"LÁ CHẮN\"."],"id":30,"tags":["LACHAN","KETLIEU"],"kw":["TẦM XA","LÁ CHẮN"],"fx":[[],[],[]]},{"n":"AETHER & HEMERA","t":"OLYMPUS","c":5,"sum":false,"s":[[4,4],[8,8],[16,16]],"k":["Khi đồng minh phía trước đơn vị này bị tấn công → cho nó +4 \"MÁU\" và \"LÁ CHẮN\". (1 lần trong chiến đấu)","Khi đồng minh phía trước đơn vị này bị tấn công → cho nó +8 \"MÁU\" và \"LÁ CHẮN\". (2 lần trong chiến đấu)","Khi đồng minh phía trước đơn vị này bị tấn công → cho nó +16 \"MÁU\" và \"LÁ CHẮN\". (3 lần trong chiến đấu)"],"id":31,"tags":["LACHAN"],"kw":["LÁ CHẮN"],"fx":[[{"tr":"ATK","a":0,"h":4,"lim":1,"tg":"ally"}],[{"tr":"ATK","a":0,"h":8,"lim":2,"tg":"ally"}],[{"tr":"ATK","a":0,"h":16,"lim":3,"tg":"ally"}]]},{"n":"CHIMERA","t":"OLYMPUS","c":4,"sum":false,"s":[[6,6],[12,12],[24,24]],"k":["\"TẤN CÔNG\"-\"PHẢN CÔNG\": ĐỐT(3) tất cả kẻ địch cùng cột với mục tiêu.","\"TẤN CÔNG\"-\"PHẢN CÔNG\": ĐỐT(6) tất cả kẻ địch cùng cột + 1 cột kế bên.","\"TẤN CÔNG\"-\"PHẢN CÔNG\": ĐỐT(6) tất cả kẻ địch cùng cột + mọi cột liền kề."],"id":32,"tags":["DOT"],"kw":["ĐỐT"],"fx":[[],[],[]]},{"n":"MINOTAUR","t":"OLYMPUS","c":4,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["\"KHAI TRẬN\": Cho 1 đồng minh Olympus ngẫu nhiên +5/+5 và LÁ CHẮN.","\"KHAI TRẬN\": Cho 2 đồng minh Olympus ngẫu nhiên +5/+5 và LÁ CHẮN.","\"KHAI TRẬN\": Cho 2 đồng minh Olympus ngẫu nhiên +10/+10 và LÁ CHẮN."],"id":33,"tags":["LACHAN"],"kw":["LÁ CHẮN"],"fx":[[{"tr":"OPEN","a":5,"h":5,"lim":0,"tg":"ally"}],[{"tr":"OPEN","a":5,"h":5,"lim":0,"tg":"ally"}],[{"tr":"OPEN","a":10,"h":10,"lim":0,"tg":"ally"}]]},{"n":"CHARON","t":"OLYMPUS","c":4,"sum":false,"s":[[4,4],[8,8],[16,16]],"k":["\"TRIỂN KHAI\": Chọn 1 đồng minh Olympus — nó giữ lại chỉ số và cường hóa nhận được trong chiến đấu.","\"TRIỂN KHAI\": Chọn 1 đồng minh Olympus — nó giữ lại gấp đôi chỉ số và cường hóa nhận được trong chiến đấu.","\"TRIỂN KHAI\": Chọn 2 đồng minh Olympus — chúng giữ lại gấp đôi chỉ số và cường hóa nhận được trong chiến đấu."],"id":34,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"PROMETHEUS","t":"OLYMPUS","c":4,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["\"TÁI SINH\"-\"TỬ VONG\": Hiệu ứng ĐỐT gây thêm +1 sát thương lượt này.","\"TÁI SINH\"-\"TỬ VONG\": Hiệu ứng ĐỐT gây thêm +2 sát thương lượt này.","\"TÁI SINH\"-\"TỬ VONG\": Hiệu ứng ĐỐT gây thêm +4 sát thương lượt này."],"id":35,"tags":["TAISINH","DOT"],"kw":["ĐỐT"],"fx":[[],[],[]]},{"n":"EVERSPING","t":"OLYMPUS","c":3,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["\"TRIỂN KHAI\" và \"KHAI TRẬN\": Cho tất cả đồng minh Olympus khác +2/+2","\"TRIỂN KHAI\" và \"KHAI TRẬN\": Cho tất cả đồng minh Olympus khác +4/+4","\"TRIỂN KHAI\" và \"KHAI TRẬN\": Cho tất cả đồng minh Olympus khác +8/+8"],"id":36,"tags":[],"kw":[],"fx":[[{"tr":"OPEN","a":2,"h":2,"lim":0,"tg":"allies"}],[{"tr":"OPEN","a":4,"h":4,"lim":0,"tg":"allies"}],[{"tr":"OPEN","a":8,"h":8,"lim":0,"tg":"allies"}]]},{"n":"MEDEA","t":"OLYMPUS","c":3,"sum":false,"s":[[4,3],[8,6],[16,12]],"k":["\"KHAI TRẬN\": Cho đồng minh Olympus +4 \"SÁT THƯƠNG\" (+1 \"SÁT THƯƠNG\" \"VĨNH VIỄN\" sau khi ngươi sử dụng 3 lá bài)","\"KHAI TRẬN\": Cho đồng minh Olympus +8 \"SÁT THƯƠNG\" (+2 \"SÁT THƯƠNG\" \"VĨNH VIỄN\" sau khi ngươi sử dụng 3 lá bài)","\"KHAI TRẬN\": Cho đồng minh Olympus +16 \"SÁT THƯƠNG\" (+4 \"SÁT THƯƠNG\" \"VĨNH VIỄN\" sau khi ngươi sử dụng 3 lá bài)"],"id":37,"tags":[],"kw":[],"fx":[[{"tr":"OPEN","a":4,"h":0,"lim":0,"tg":"ally"}],[{"tr":"OPEN","a":8,"h":0,"lim":0,"tg":"ally"}],[{"tr":"OPEN","a":16,"h":0,"lim":0,"tg":"ally"}]]},{"n":"CRINBROG","t":"OLYMPUS","c":3,"sum":false,"s":[[1,3],[2,6],[4,12]],"k":["Sau khi một đồng minh mất \"LÁ CHẮN\", cho đồng minh đó \"LÁ CHẮN\" và +4 \"SÁT THƯƠNG\" (Hiệu ứng kích hoạt 1 lần trong chiến đấu)","Sau khi một đồng minh mất \"LÁ CHẮN\", cho đồng minh đó \"LÁ CHẮN\" và +8 \"SÁT THƯƠNG\" (Hiệu ứng kích hoạt 1 lần trong chiến đấu)","Sau khi một đồng minh mất \"LÁ CHẮN\", cho đồng minh đó \"LÁ CHẮN\" và +16 \"SÁT THƯƠNG\" (Hiệu ứng kích hoạt 1 lần trong chiến đấu)"],"id":38,"tags":["LACHAN"],"kw":["LÁ CHẮN"],"fx":[[{"tr":"OTHER","a":4,"h":0,"lim":0,"tg":"ally"}],[{"tr":"OTHER","a":8,"h":0,"lim":0,"tg":"ally"}],[{"tr":"OTHER","a":16,"h":0,"lim":0,"tg":"ally"}]]},{"n":"GRAFIGI","t":"OLYMPUS","c":3,"sum":false,"s":[[3,1],[6,2],[12,4]],"k":["\"TRIỂN KHAI\": Hiệu ứng \"ĐỐT\" của ngươi gây thêm 2 sát thương trong trận này","\"TRIỂN KHAI\": Hiệu ứng \"ĐỐT\" của ngươi gây thêm 4 sát thương trong trận này","\"TRIỂN KHAI\": Hiệu ứng \"ĐỐT\" của ngươi gây thêm 8 sát thương trong trận này"],"id":39,"tags":["DOT"],"kw":["ĐỐT"],"fx":[[],[],[]]},{"n":"SCYLLA","t":"OLYMPUS","c":3,"sum":false,"s":[[4,1],[8,2],[16,4]],"k":["\"KẾT LIỄU(1)\": Nhận 1 \"PHÉP THÁNH ĐỀN\" ngẫu nhiên từ CẤP 2","\"KẾT LIỄU(1)\": Nhận 1 \"PHÉP THÁNH ĐỀN\" ngẫu nhiên từ CẤP 3","\"KẾT LIỄU(1)\": Nhận 2 \"PHÉP THÁNH ĐỀN\" ngẫu nhiên từ CẤP 3"],"id":40,"tags":["KETLIEU","PHEP"],"kw":[],"fx":[[],[],[]]},{"n":"HYDRA","t":"OLYMPUS","c":3,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["\"TẤN CÔNG\" - \"PHẢN CÔNG\": \"ĐỐT(3)\" mục tiêu và kẻ địch kế bên nó","\"TẤN CÔNG\" - \"PHẢN CÔNG\": \"ĐỐT(6)\" mục tiêu và kẻ địch kế bên nó","\"TẤN CÔNG\" - \"PHẢN CÔNG\": \"ĐỐT(9)\" mục tiêu và kẻ địch kế bên nó"],"id":41,"tags":["DOT"],"kw":["ĐỐT"],"fx":[[],[],[]]},{"n":"AETOS","t":"OLYMPUS","c":2,"sum":false,"s":[[2,1],[4,2],[8,4]],"k":["Bất cứ khi nào một đồng minh Olympus tấn công, cho AETOS +2/+1","Bất cứ khi nào một đồng minh Olympus tấn công, cho AETOS +4/+2","Bất cứ khi nào một đồng minh Olympus tấn công, cho AETOS +8/+4"],"id":42,"tags":[],"kw":[],"fx":[[{"tr":"ATK","a":2,"h":1,"lim":0,"tg":"ally"}],[{"tr":"ATK","a":4,"h":2,"lim":0,"tg":"ally"}],[{"tr":"ATK","a":8,"h":4,"lim":0,"tg":"ally"}]]},{"n":"HỌC GIẢ HY LẠP","t":"OLYMPUS","c":2,"sum":false,"s":[[4,4],[8,8],[16,16]],"k":["\"THÁNH ĐỀN\" sẽ cho 2 \"PHÉP THÁNH ĐỀN\". \"TRIỂN KHAI\" và \"KẾT LƯỢT\": 1 Phép đầu tiên mua sẽ được giảm 1 vàng","\"THÁNH ĐỀN\" sẽ cho 2 \"PHÉP THÁNH ĐỀN\". \"TRIỂN KHAI\" và \"KẾT LƯỢT\": 2 Phép đầu tiên mua sẽ được giảm 1 vàng","\"THÁNH ĐỀN\" sẽ cho 2 \"PHÉP THÁNH ĐỀN\". \"TRIỂN KHAI\" và \"KẾT LƯỢT\": 3 Phép đầu tiên mua sẽ được giảm 2 vàng"],"id":43,"tags":["PHEP"],"kw":[],"fx":[[],[],[]]},{"n":"HERCULES","t":"OLYMPUS","c":2,"sum":false,"s":[[4,4],[8,8],[16,16]],"k":["HERCULES giữ tất cả chỉ số và những cường hóa nhận được trong trận chiến","HERCULES giữ gấp đôi tất cả chỉ số và những cường hóa nhận được trong trận chiến","\"LÁ CHẮN\" - HERCULES giữ gấp đôi tất cả chỉ số và những cường hóa nhận được trong trận chiến"],"id":44,"tags":["LACHAN"],"kw":["LÁ CHẮN"],"fx":[[],[],[]]},{"n":"ORTHROS","t":"OLYMPUS","c":1,"sum":false,"s":[[2,1],[4,2],[8,4]],"k":["\"KHIÊU KHÍCH\" - \"LÁ CHẮN\"","\"KHIÊU KHÍCH\" - \"LÁ CHẮN\": Sau khi mất \"LÁ CHẮN\", nhận +2/+2","\"KHIÊU KHÍCH\" - \"LÁ CHẮN\": Sau khi mất \"LÁ CHẮN\", nhận +4/+4"],"id":45,"tags":["LACHAN"],"kw":["KHIÊU KHÍCH","LÁ CHẮN"],"fx":[[],[{"tr":"OTHER","a":2,"h":2,"lim":0,"tg":"self"}],[{"tr":"OTHER","a":4,"h":4,"lim":0,"tg":"self"}]]},{"n":"NAREA","t":"OLYMPUS","c":1,"sum":false,"s":[[3,2],[6,4],[12,8]],"k":["Mỗi 3 lần \"KẾT LƯỢT\", nhận 1 đơn vị Olympus ngẫu nhiên bằng hoặc nhỏ hơn cấp \"THÁNH ĐỀN\"","Mỗi 3 lần \"KẾT LƯỢT\", nhận 2 đơn vị Olympus ngẫu nhiên bằng hoặc nhỏ hơn cấp \"THÁNH ĐỀN\"","Mỗi 3 lần \"KẾT LƯỢT\", nhận 3 đơn vị Olympus ngẫu nhiên bằng hoặc nhỏ hơn cấp \"THÁNH ĐỀN\""],"id":46,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"SKADI","t":"YGGDRASIL","c":6,"sum":false,"s":[[9,2],[18,4],[36,8]],"k":["\"TẦM XA\"-\"KẾT LIỄU(1)\": Cho 1 đồng minh khác +8 \"SÁT THƯƠNG\" và kích hoạt hiệu ứng \"KẾT LIỄU\" của đồng minh đó","\"TẦM XA\"-\"KẾT LIỄU(1)\": Cho 2 đồng minh khác +16 \"SÁT THƯƠNG\" và kích hoạt hiệu ứng \"KẾT LIỄU\" của đồng minh đó","\"TẦM XA\"-\"KẾT LIỄU(1)\": Cho 5 đồng minh khác +24 \"SÁT THƯƠNG\" và kích hoạt hiệu ứng \"KẾT LIỄU\" của đồng minh đó"],"id":47,"tags":["KETLIEU"],"kw":["TẦM XA"],"fx":[[{"tr":"KILL","a":8,"h":0,"lim":0,"tg":"ally"}],[{"tr":"KILL","a":16,"h":0,"lim":0,"tg":"ally"}],[{"tr":"KILL","a":24,"h":0,"lim":0,"tg":"ally"}]]},{"n":"TYR","t":"YGGDRASIL","c":6,"sum":false,"s":[[6,8],[12,16],[24,32]],"k":["\"TRẢM KÍCH\" - Bất cứ khi nào một đồng minh YGGDRASIL nhận sát thương, TYR và các đồng minh liền kề nhận +1/+1 \"VĨNH VIỄN\"","\"TRẢM KÍCH\" - Bất cứ khi nào một đồng minh YGGDRASIL nhận sát thương, TYR và các đồng minh liền kề nhận +2/+2 \"VĨNH VIỄN\"","\"TRẢM KÍCH\" - Bất cứ khi nào một đồng minh YGGDRASIL nhận sát thương, TYR và các đồng minh liền kề nhận +4/+4 \"VĨNH VIỄN\""],"id":48,"tags":["NHANST"],"kw":["TRẢM KÍCH"],"fx":[[{"tr":"HIT","a":1,"h":1,"lim":0,"tg":"self"}],[{"tr":"HIT","a":2,"h":2,"lim":0,"tg":"self"}],[{"tr":"HIT","a":4,"h":4,"lim":0,"tg":"self"}]]},{"n":"THOR","t":"YGGDRASIL","c":6,"sum":false,"s":[[8,10],[16,20],[32,40]],"k":["\"KẾT LIỄU(1)\": Gây sát thương thừa lên 1 kẻ địch bên cạnh kẻ địch bị kết liễu","\"KẾT LIỄU(1)\": Gây sát thương thừa lên 1 kẻ địch liền kề kẻ địch bị kết liễu","\"KẾT LIỄU(1)\": Gây sát thương thừa lên 2 kẻ địch liền kề kẻ địch bị kết liễu"],"id":49,"tags":["KETLIEU"],"kw":[],"fx":[[],[],[]]},{"n":"BALDUR","t":"YGGDRASIL","c":5,"sum":false,"s":[[10,10],[20,20],[40,40]],"k":["\"TẤN CÔNG\" và \"TỬ VONG\": Gây 1 sát thương lên tất cả đồng minh","\"TẤN CÔNG\" và \"TỬ VONG\": Gây 1 sát thương lên tất cả đồng minh, 2 lần","\"TẤN CÔNG\" và \"TỬ VONG\": Gây 1 sát thương lên tất cả đồng minh, 3 lần"],"id":50,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"SIF","t":"YGGDRASIL","c":5,"sum":false,"s":[[2,7],[4,14],[8,28]],"k":["Bất cứ khi nào một đồng minh YGGDRASIL nhận sát thương, SIF cho 3 đồng minh ngẫu nhiên YGGDRASIL ngẫu nhiên +1/+1 \"VĨNH VIỄN\"","Bất cứ khi nào một đồng minh YGGDRASIL nhận sát thương, SIF cho 3 đồng minh ngẫu nhiên YGGDRASIL ngẫu nhiên +2/+2 \"VĨNH VIỄN\"","Bất cứ khi nào một đồng minh YGGDRASIL nhận sát thương, SIF cho 6 đồng minh ngẫu nhiên YGGDRASIL ngẫu nhiên +4/+4 \"VĨNH VIỄN\""],"id":51,"tags":["NHANST"],"kw":[],"fx":[[{"tr":"HIT","a":1,"h":1,"lim":0,"tg":"ally"}],[{"tr":"HIT","a":2,"h":2,"lim":0,"tg":"ally"}],[{"tr":"HIT","a":4,"h":4,"lim":0,"tg":"ally"}]]},{"n":"FRIGGA","t":"YGGDRASIL","c":5,"sum":false,"s":[[1,12],[2,24],[4,48]],"k":["\"LÁ CHẮN\" - \"KHÔNG THỂ TẤN CÔNG\" - \"HÀO QUANG\": FRIGGA nhận sát thương thay cho đồng minh phía trước (Ngoại trừ FRIGGA)","\"LÁ CHẮN\" - \"KHÔNG THỂ TẤN CÔNG\" - \"HÀO QUANG\": FRIGGA nhận sát thương thay cho đồng minh liền kề (Ngoại trừ FRIGGA)","\"LÁ CHẮN\" - \"KHÔNG THỂ TẤN CÔNG\" - \"HÀO QUANG\": FRIGGA nhận sát thương thay cho tất cả đồng minh (Ngoại trừ FRIGGA)"],"id":52,"tags":["LACHAN","NHANST"],"kw":["KHÔNG THỂ TẤN CÔNG","HÀO QUANG","LÁ CHẮN"],"fx":[[],[],[]]},{"n":"HEIMDALL","t":"YGGDRASIL","c":5,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["Bất cứ khi nào đồng minh kích hoạt \"KẾT LIỄU\", cho tất cả đồng minh +2/+2 \"VĨNH VIỄN\"","Bất cứ khi nào đồng minh kích hoạt \"KẾT LIỄU\", cho tất cả đồng minh +4/+4 \"VĨNH VIỄN\"","Bất cứ khi nào đồng minh kích hoạt \"KẾT LIỄU\", cho tất cả đồng minh +8/+8 \"VĨNH VIỄN\""],"id":53,"tags":["KETLIEU"],"kw":[],"fx":[[{"tr":"KILL","a":2,"h":2,"lim":0,"tg":"allies"}],[{"tr":"KILL","a":4,"h":4,"lim":0,"tg":"allies"}],[{"tr":"KILL","a":8,"h":8,"lim":0,"tg":"allies"}]]},{"n":"KẺ CUỒNG NỘ","t":"YGGDRASIL","c":4,"sum":false,"s":[[8,6],[16,12],[32,24]],"k":["\"KẾT LIỄU(1)\": Nhận +3/+3 \"VĨNH VIỄN\". \"KẾT LIỄU(2)\": Nhân đôi \"SÁT THƯƠNG\" và tấn công ngay lập tức","\"KẾT LIỄU(1)\": Nhận +6/+6 \"VĨNH VIỄN\". \"KẾT LIỄU(2)\": Nhân đôi \"SÁT THƯƠNG\" và tấn công ngay lập tức","\"KẾT LIỄU(1)\": Nhận +9/+9 \"VĨNH VIỄN\". \"KẾT LIỄU(2)\": Nhân đôi \"SÁT THƯƠNG\" và tấn công ngay lập tức"],"id":54,"tags":["KETLIEU"],"kw":[],"fx":[[{"tr":"KILL","a":3,"h":3,"lim":0,"tg":"self"}],[{"tr":"KILL","a":6,"h":6,"lim":0,"tg":"self"}],[{"tr":"KILL","a":9,"h":9,"lim":0,"tg":"self"}]]},{"n":"DRAUGR","t":"YGGDRASIL","c":4,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["\"KHIÊU KHÍCH\"-\"TỬ VONG\": Cho 1 đồng minh khác YGGDRASIL hiệu ứng \"TỬ VONG\": Triệu hồi một DRAUGR (Ngoại trừ các DRAUGR khác)","\"KHIÊU KHÍCH\"-\"TỬ VONG\": Cho 2 đồng minh khác YGGDRASIL hiệu ứng \"TỬ VONG\": Triệu hồi một DRAUGR (Ngoại trừ các DRAUGR khác)","\"KHIÊU KHÍCH\"-\"TỬ VONG\": Cho 3 đồng minh khác YGGDRASIL hiệu ứng \"TỬ VONG\": Triệu hồi một DRAUGR (Ngoại trừ các DRAUGR khác)"],"id":55,"tags":["TRIEUHOI"],"kw":["KHIÊU KHÍCH"],"fx":[[],[],[]]},{"n":"JOTUNN CÂY","t":"YGGDRASIL","c":4,"sum":false,"s":[[5,5],[10,10],[20,20]],"k":["Bất cứ khi nào đồng minh YGGDRASIL nhận sát thương, JOTUNN CÂY nhận +1/+1","Bất cứ khi nào đồng minh YGGDRASIL nhận sát thương, JOTUNN CÂY nhận +2/+2","Bất cứ khi nào đồng minh YGGDRASIL nhận sát thương, JOTUNN CÂY nhận +4/+4"],"id":56,"tags":["NHANST"],"kw":[],"fx":[[{"tr":"HIT","a":1,"h":1,"lim":0,"tg":"self"}],[{"tr":"HIT","a":2,"h":2,"lim":0,"tg":"self"}],[{"tr":"HIT","a":4,"h":4,"lim":0,"tg":"self"}]]},{"n":"JOTUNN BĂNG","t":"YGGDRASIL","c":4,"sum":false,"s":[[1,8],[2,16],[3,32]],"k":["\"KHIÊU KHÍCH\": Bất cứ khi nào JOTUNN BĂNG nhận sát thương, gây 1 sát thương lên mọi đồng minh liền kề (2 lần trong chiến đấu)","\"KHIÊU KHÍCH\": Bất cứ khi nào JOTUNN BĂNG nhận sát thương, gây 1 sát thương lên mọi đồng minh liền kề (4 lần trong chiến đấu)","\"KHIÊU KHÍCH\": Bất cứ khi nào JOTUNN BĂNG nhận sát thương, gây 1 sát thương lên mọi đồng minh liền kề, lặp lại 2 lần (4 lần trong chiến đấu)"],"id":57,"tags":["NHANST"],"kw":["KHIÊU KHÍCH"],"fx":[[],[],[]]},{"n":"BRAGI","t":"YGGDRASIL","c":4,"sum":false,"s":[[1,5],[2,10],[4,20]],"k":["Sau khi một đồng minh kết liễu kẻ địch, cho tất cả đồng minh trên cùng hàng +3 \"SÁT THƯƠNG\" \"VĨNH VIỄN\"","Sau khi một đồng minh kết liễu kẻ địch, cho tất cả đồng minh trên cùng hàng +6 \"SÁT THƯƠNG\" \"VĨNH VIỄN\"","Sau khi một đồng minh kết liễu kẻ địch, cho tất cả đồng minh trên cùng hàng +12 \"SÁT THƯƠNG\" \"VĨNH VIỄN\""],"id":58,"tags":["KETLIEU"],"kw":[],"fx":[[{"tr":"OTHER","a":3,"h":0,"lim":0,"tg":"allies"}],[{"tr":"OTHER","a":6,"h":0,"lim":0,"tg":"allies"}],[{"tr":"OTHER","a":12,"h":0,"lim":0,"tg":"allies"}]]},{"n":"TIÊN ÁNH SÁNG","t":"YGGDRASIL","c":3,"sum":false,"s":[[0,4],[0,8],[0,16]],"k":["\"KHÔNG THỂ TẤN CÔNG\": Khi một đồng minh tấn công, cho nó +4 máu \"VĨNH VIỄN\" (2 lần trong chiến đấu)","\"KHÔNG THỂ TẤN CÔNG\": Khi một đồng minh tấn công, cho nó +8 máu \"VĨNH VIỄN\" (4 lần trong chiến đấu)","\"KHÔNG THỂ TẤN CÔNG\": Khi một đồng minh tấn công, cho nó +16 máu \"VĨNH VIỄN\" (4 lần trong chiến đấu)"],"id":59,"tags":[],"kw":["KHÔNG THỂ TẤN CÔNG"],"fx":[[],[],[]]},{"n":"KELPIE","t":"YGGDRASIL","c":3,"sum":false,"s":[[2,1],[4,2],[8,4]],"k":["\"TỬ VONG\": Khiến tất cả kẻ địch trong cùng cột \"SUY YẾU\"","\"TỬ VONG\": Khiến tất cả kẻ địch trong cùng cột và một cột bên cạnh \"SUY YẾU\"","\"TỬ VONG\": Khiến tất cả kẻ địch \"SUY YẾU\""],"id":60,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"VALKYRIE","t":"YGGDRASIL","c":3,"sum":false,"s":[[4,4],[8,8],[16,16]],"k":["\"KẾT LIỄU(1)\": VALKYRIE ở mọi nơi có +2/+1 trong trận này","\"KẾT LIỄU(1)\": VALKYRIE ở mọi nơi có +4/+2 trong trận này","\"KẾT LIỄU(1)\": VALKYRIE ở mọi nơi có +8/+4 trong trận này"],"id":61,"tags":["KETLIEU"],"kw":[],"fx":[[],[],[]]},{"n":"TIÊN HẮC ÁM","t":"YGGDRASIL","c":3,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["\"KHÔNG THỂ TẤN CÔNG\": Bất cứ khi nào đồng minh cùng cột tấn công, gây 1 sát thương lên đồng minh đó và cho +4 \"SÁT THƯƠNG\" \"VĨNH VIỄN\"","\"KHÔNG THỂ TẤN CÔNG\": Bất cứ khi nào đồng minh cùng cột tấn công, gây 1 sát thương lên đồng minh đó và cho +8 \"SÁT THƯƠNG\" \"VĨNH VIỄN\"","\"KHÔNG THỂ TẤN CÔNG\": Bất cứ khi nào đồng minh cùng cột tấn công, gây 1 sát thương lên đồng minh đó và cho +16 \"SÁT THƯƠNG\" \"VĨNH VIỄN\""],"id":62,"tags":[],"kw":["KHÔNG THỂ TẤN CÔNG"],"fx":[[{"tr":"ATK","a":4,"h":0,"lim":0,"tg":"ally"}],[{"tr":"ATK","a":8,"h":0,"lim":0,"tg":"ally"}],[{"tr":"ATK","a":16,"h":0,"lim":0,"tg":"ally"}]]},{"n":"YULE LAD","t":"YGGDRASIL","c":2,"sum":false,"s":[[3,1],[6,2],[12,4]],"k":["\"TỬ VONG\": Triệu hồi 1 \"CON CỪU\" lên sân của đối phương, \"CON CỪU\" nó \"KHÔNG THỂ TẤN CÔNG\"","\"TỬ VONG\": Triệu hồi 2 \"CON CỪU\" lên sân của đối phương, \"CON CỪU\" nó \"KHÔNG THỂ TẤN CÔNG\"","\"TỬ VONG\": Triệu hồi 3 \"CON CỪU\" lên sân của đối phương, \"CON CỪU\" nó \"KHÔNG THỂ TẤN CÔNG\""],"id":63,"tags":["TRIEUHOI"],"kw":["KHÔNG THỂ TẤN CÔNG"],"fx":[[],[],[]]},{"n":"HULDRA CHỮA TRỊ","t":"YGGDRASIL","c":2,"sum":false,"s":[[1,4],[2,8],[4,16]],"k":["Khi có đồng minh nhận sát thương, cho đồng minh đó +1 \"MÁU\" (3 lần trong chiến đấu)","Khi có đồng minh nhận sát thương, cho đồng minh đó +2 \"MÁU\" (3 lần trong chiến đấu)","Khi có đồng minh nhận sát thương, cho đồng minh đó +4 \"MÁU\" (3 lần trong chiến đấu)"],"id":64,"tags":["NHANST"],"kw":[],"fx":[[{"tr":"HIT","a":0,"h":1,"lim":3,"tg":"ally"}],[{"tr":"HIT","a":0,"h":2,"lim":3,"tg":"ally"}],[{"tr":"HIT","a":0,"h":4,"lim":3,"tg":"ally"}]]},{"n":"HULDRA THỢ SĂN","t":"YGGDRASIL","c":2,"sum":false,"s":[[4,2],[8,4],[16,8]],"k":["\"KẾT LIỄU(1)\": Cho 1 đồng minh khác +4 \"MÁU\"","\"KẾT LIỄU(1)\": Cho 1 đồng minh khác +8 \"MÁU\"","\"KẾT LIỄU(1)\": Cho 1 đồng minh khác +16 \"MÁU\""],"id":65,"tags":["KETLIEU"],"kw":[],"fx":[[{"tr":"KILL","a":0,"h":4,"lim":0,"tg":"ally"}],[{"tr":"KILL","a":0,"h":8,"lim":0,"tg":"ally"}],[{"tr":"KILL","a":0,"h":16,"lim":0,"tg":"ally"}]]},{"n":"QUỶ LÙN","t":"YGGDRASIL","c":2,"sum":false,"s":[[1,4],[2,8],[4,16]],"k":["Bất cứ khi nào QUỶ LÙN nhận sát thương, nhận +1 \"MÁU\" \"VĨNH VIỄN\" (Đổi \"MÁU\" và \"SÁT THƯƠNG\" mỗi lần kích hoạt)","Bất cứ khi nào QUỶ LÙN nhận sát thương, nhận +2 \"MÁU\" \"VĨNH VIỄN\" (Đổi \"MÁU\" và \"SÁT THƯƠNG\" mỗi lần kích hoạt)","Bất cứ khi nào QUỶ LÙN nhận sát thương, nhận +4 \"MÁU\" \"VĨNH VIỄN\" (Đổi \"MÁU\" và \"SÁT THƯƠNG\" mỗi lần kích hoạt)"],"id":66,"tags":["NHANST"],"kw":[],"fx":[[{"tr":"HIT","a":0,"h":1,"lim":0,"tg":"self"}],[{"tr":"HIT","a":0,"h":2,"lim":0,"tg":"self"}],[{"tr":"HIT","a":0,"h":4,"lim":0,"tg":"self"}]]},{"n":"VIKING","t":"YGGDRASIL","c":1,"sum":false,"s":[[1,5],[2,10],[4,20]],"k":["\"KẾT LIỄU(1)\": Nhận +1 \"SÁT THƯƠNG\" \"VĨNH VIỄN\"","\"KẾT LIỄU(1)\": Nhận +2 \"SÁT THƯƠNG\" \"VĨNH VIỄN\"","\"KẾT LIỄU(1)\": Nhận +4 \"SÁT THƯƠNG\" \"VĨNH VIỄN\""],"id":67,"tags":["KETLIEU"],"kw":[],"fx":[[{"tr":"KILL","a":1,"h":0,"lim":0,"tg":"self"}],[{"tr":"KILL","a":2,"h":0,"lim":0,"tg":"self"}],[{"tr":"KILL","a":4,"h":0,"lim":0,"tg":"self"}]]},{"n":"VALAVN","t":"YGGDRASIL","c":1,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["\"TẤN CÔNG\": Khiến mục tiêu bị \"SUY YẾU\"","\"TẤN CÔNG\": Khiến mục tiêu và 1 kẻ địch khác bị \"SUY YẾU\"","\"TẤN CÔNG\": Khiến mục tiêu và 2 kẻ địch khác bị \"SUY YẾU\""],"id":68,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"CON CỪU","t":"YGGDRASIL","c":1,"sum":false,"s":[[0,1],[0,1],[0,1]],"k":["\"KHIÊU KHÍCH\"","\"KHIÊU KHÍCH\"","\"KHIÊU KHÍCH\""],"id":69,"tags":[],"kw":["KHIÊU KHÍCH"],"fx":[[],[],[]]},{"n":"TIỂU LONG NỮ","t":"SHENZHOU","c":6,"sum":false,"s":[[8,8],[16,16],[32,32]],"k":["\"TẤN CÔNG\" - \"PHẢN CÔNG\": Gây 2 \"SÁT THƯƠNG\" (cho mỗi viên \"TIÊN ĐAN\" đơn vị này được nhận) lên mục tiêu (2 lần trong chiến đấu)","\"TẤN CÔNG\" - \"PHẢN CÔNG\": Gây 4 \"SÁT THƯƠNG\" (cho mỗi viên \"TIÊN ĐAN\" đơn vị này được nhận) lên mục tiêu (4 lần trong chiến đấu)","\"TẤN CÔNG\" - \"PHẢN CÔNG\": Gây 8 \"SÁT THƯƠNG\" (cho mỗi viên \"TIÊN ĐAN\" đơn vị này được nhận) lên mục tiêu (99 lần trong chiến đấu)"],"id":70,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"TÔN NGỘ KHÔNG","t":"SHENZHOU","c":6,"sum":false,"s":[[6,6],[12,12],[24,24]],"k":["\"LUYỆN ĐAN(1)\" Chọn cho một \"TÔN NGỘ KHÔNG\" trên sân +6/+6 \"VĨNH VIỄN\" hoặc \"XUYÊN KÍCH\" hoặc \"TRẢM KÍCH\" hoặc \"LÁ CHẮN\" cho đến lượt sau","\"LUYỆN ĐAN(2)\" Chọn cho một \"TÔN NGỘ KHÔNG\" trên sân +6/+6 \"VĨNH VIỄN\" hoặc \"XUYÊN KÍCH\" hoặc \"TRẢM KÍCH\" hoặc \"LÁ CHẮN\" cho đến lượt sau","\"LUYỆN ĐAN(3)\" Chọn cho một \"TÔN NGỘ KHÔNG\" trên sân +6/+6 \"VĨNH VIỄN\" hoặc \"XUYÊN KÍCH\" hoặc \"TRẢM KÍCH\" hoặc \"LÁ CHẮN\" cho đến lượt sau"],"id":71,"tags":["LACHAN","TIENDAN"],"kw":["XUYÊN KÍCH","TRẢM KÍCH","LÁ CHẮN"],"fx":[[],[],[]]},{"n":"TRIỆU KHỔNG MINH","t":"SHENZHOU","c":6,"sum":false,"s":[[9,9],[18,18],[36,36]],"k":["\"KẾT LƯỢT\" - \"TIÊN ĐAN\" của ngươi cho thêm +1/+1 trong trận này","\"KẾT LƯỢT\" - \"TIÊN ĐAN\" của ngươi cho thêm +2/+2 trong trận này","\"KẾT LƯỢT\" - \"TIÊN ĐAN\" của ngươi cho thêm +4/+4 trong trận này"],"id":72,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"THÂN CÔNG BÁO","t":"SHENZHOU","c":5,"sum":false,"s":[[7,7],[14,14],[28,28]],"k":["\"LUYỆN ĐAN(1)\": Cho 1 đơn vị SHENZHOU \"TÁI SINH\" với toàn bộ \"SÁT THƯƠNG\" cho đến lượt sau","\"LUYỆN ĐAN(2)\": Cho 1 đơn vị SHENZHOU \"TÁI SINH\" với toàn bộ \"SÁT THƯƠNG\" cho đến lượt sau","\"LUYỆN ĐAN(3)\": Cho 1 đơn vị SHENZHOU \"TÁI SINH\" với toàn bộ \"SÁT THƯƠNG\" cho đến lượt sau"],"id":73,"tags":["TAISINH","TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"LONG CÁT CÔNG CHÚA","t":"SHENZHOU","c":5,"sum":false,"s":[[6,6],[12,12],[24,24]],"k":["Bất cứ khi nào đơn vị này nhận \"TIÊN ĐAN\", cho 1 đồng minh SHENZHOU khác trên sân cùng loại \"TIÊN ĐAN\" đó","Bất cứ khi nào đơn vị này nhận \"TIÊN ĐAN\", cho 2 đồng minh SHENZHOU khác trên sân cùng loại \"TIÊN ĐAN\" đó","Bất cứ khi nào đơn vị này nhận \"TIÊN ĐAN\", cho 3 đồng minh SHENZHOU khác trên sân cùng loại \"TIÊN ĐAN\" đó"],"id":74,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"KHƯƠNG TỬ NHA","t":"SHENZHOU","c":5,"sum":false,"s":[[4,6],[8,12],[16,24]],"k":["\"KẾT LƯỢT\": Kích hoạt hiệu ứng \"TRIỂN KHAI\" của đồng minh bên phải","\"KẾT LƯỢT\": Kích hoạt hiệu ứng \"TRIỂN KHAI\" của những đồng minh bên cạnh","\"KẾT LƯỢT\": Kích hoạt hiệu ứng \"TRIỂN KHAI\" của những đồng minh liền kề"],"id":75,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"HI HÒA","t":"SHENZHOU","c":5,"sum":false,"s":[[2,6],[4,12],[8,24]],"k":["\"LUYỆN ĐAN(1)\": Nhận 1 lá \"LONG LÂN ĐAN\"","\"LUYỆN ĐAN(2)\": Nhận 2 lá \"LONG LÂN ĐAN\"","\"LUYỆN ĐAN(3)\": Nhận 3 lá \"LONG LÂN ĐAN\""],"id":76,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"ĐẮC KỶ","t":"SHENZHOU","c":5,"sum":false,"s":[[6,1],[12,2],[24,4]],"k":["\"TỬ VONG\": Nhận 1 viên \"TIÊN ĐAN\" ngẫu nhiên, với mỗi đồng minh SHENZHOU trên sân","\"TỬ VONG\": Nhận 2 viên \"TIÊN ĐAN\" ngẫu nhiên, với mỗi đồng minh SHENZHOU trên sân","\"TỬ VONG\": Nhận 4 viên \"TIÊN ĐAN\" ngẫu nhiên, với mỗi đồng minh SHENZHOU trên sân"],"id":77,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"LÔI CHẤN TỬ","t":"SHENZHOU","c":4,"sum":false,"s":[[8,3],[16,6],[32,12]],"k":["Bất cứ khi nào đơn vị này nhận \"TIÊN ĐAN\", gây sát thương bằng với số \"TIÊN ĐAN\" nhận được lên 1 kẻ địch ngẫu nhiên (3 lần trong chiến đấu)","Bất cứ khi nào đơn vị này nhận \"TIÊN ĐAN\", gây sát thương bằng với số \"TIÊN ĐAN\" nhận được lên 1 kẻ địch ngẫu nhiên (6 lần trong chiến đấu)","Bất cứ khi nào đơn vị này nhận \"TIÊN ĐAN\", gây sát thương bằng với số \"TIÊN ĐAN\" nhận được lên 1 kẻ địch ngẫu nhiên (9 lần trong chiến đấu)"],"id":78,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"THẠCH CƠ NƯƠNG NƯƠNG","t":"SHENZHOU","c":4,"sum":false,"s":[[4,1],[8,2],[16,4]],"k":["\"TỬ VONG\": Nhận 1 viên \"TIÊN ĐAN\" ngẫu nhiên","\"TỬ VONG\": Nhận 2 viên \"TIÊN ĐAN\" ngẫu nhiên","\"TỬ VONG\": Nhận 4 viên \"TIÊN ĐAN\" ngẫu nhiên"],"id":79,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"ZHIJI LING","t":"SHENZHOU","c":4,"sum":false,"s":[[2,3],[4,6],[8,12]],"k":["\"TRIỂN KHAI\": Nhận 1 \"TIÊN ĐAN\" ngẫu nhiên","\"TRIỂN KHAI\": Nhận 2 \"TIÊN ĐAN\" ngẫu nhiên","\"TRIỂN KHAI\": Nhận 3 \"TIÊN ĐAN\" ngẫu nhiên"],"id":80,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"HOÀNG THIÊN HỨA","t":"SHENZHOU","c":4,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["\"KẾT LƯỢT\": Cho 1 \"THÁI CỰC ĐAN\" lên những đồng minh cùng hàng","\"KẾT LƯỢT\": Cho 2 \"THÁI CỰC ĐAN\" lên những đồng minh cùng hàng","\"KẾT LƯỢT\": Cho 3 \"THÁI CỰC ĐAN\" lên những đồng minh cùng hàng"],"id":81,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"THAO THIẾT","t":"SHENZHOU","c":3,"sum":false,"s":[[5,1],[10,2],[20,4]],"k":["\"KẾT LIỄU(1)\" Nhận 1 \"TIÊN ĐAN\" ngẫu nhiên","\"KẾT LIỄU(1)\" Nhận 2 \"TIÊN ĐAN\" ngẫu nhiên","\"KẾT LIỄU(1)\" Nhận 3 \"TIÊN ĐAN\" ngẫu nhiên"],"id":82,"tags":["TIENDAN","KETLIEU"],"kw":[],"fx":[[],[],[]]},{"n":"THỎ NGỌC","t":"SHENZHOU","c":3,"sum":false,"s":[[4,4],[8,8],[16,16]],"k":["\"TRIỂN KHAI\": \"TIÊN ĐAN\" tăng \"MÁU\" sẽ cho thêm +1 \"MÁU\" trong trận này","\"TRIỂN KHAI\": \"TIÊN ĐAN\" tăng \"MÁU\" sẽ cho thêm +2 \"MÁU\" trong trận này","\"TRIỂN KHAI\": \"TIÊN ĐAN\" tăng \"MÁU\" sẽ cho thêm +4 \"MÁU\" trong trận này"],"id":83,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"HỖN ĐỘN","t":"SHENZHOU","c":3,"sum":false,"s":[[4,1],[8,2],[16,4]],"k":["\"TỬ VONG\": \"TIÊN ĐAN\" tăng \"SÁT THƯƠNG\" sẽ cho thêm +1 \"SÁT THƯƠNG\" trong trận này","\"TỬ VONG\": \"TIÊN ĐAN\" tăng \"SÁT THƯƠNG\" sẽ cho thêm +2 \"SÁT THƯƠNG\" trong trận này","\"TỬ VONG\": \"TIÊN ĐAN\" tăng \"SÁT THƯƠNG\" sẽ cho thêm +4 \"SÁT THƯƠNG\" trong trận này"],"id":84,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"NIÊN THÚ","t":"SHENZHOU","c":3,"sum":false,"s":[[3,2],[6,4],[12,8]],"k":["\"TỬ VONG\": Cho 1 \"TIÊN ĐAN\" từ \"CẤP\" 1 lên những đồng minh liền kề","\"TỬ VONG\": Cho 1 \"TIÊN ĐAN\" từ \"CẤP\" 2 lên những đồng minh liền kề","\"TỬ VONG\": Cho 1 \"TIÊN ĐAN\" từ \"CẤP\" 2 lên những đồng minh liền kề, 2 lần"],"id":85,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"ĐẠO HẠC","t":"SHENZHOU","c":2,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["\"LUYỆN ĐAN(1)\": Nhận 1 lá \"THÁI CỰC ĐAN\"","\"LUYỆN ĐAN(2)\": Nhận 2 lá \"THÁI CỰC ĐAN\"","\"LUYỆN ĐAN(3)\": Nhận 3 lá \"THÁI CỰC ĐAN\""],"id":86,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"KHỈ NHỎ","t":"SHENZHOU","c":2,"sum":false,"s":[[1,1],[2,2],[4,4]],"k":["Bất cứ khi nào \"KHỈ NHỎ\" nhận \"TIÊN ĐAN\", nhận thêm +1/+1, Sau khi nhận 24 \"TIÊN ĐAN\", biến thành \"TÔN NGỘ KHÔNG\" lv1 (giữ nguyên chỉ số \"SÁT THƯƠNG\"/\"MÁU\" hiện tại)","Bất cứ khi nào \"KHỈ NHỎ\" nhận \"TIÊN ĐAN\", nhận thêm +2/+2, Sau khi nhận 24 \"TIÊN ĐAN\", biến thành \"TÔN NGỘ KHÔNG\" lv1 (giữ nguyên chỉ số \"SÁT THƯƠNG\"/\"MÁU\" hiện tại)","Bất cứ khi nào \"KHỈ NHỎ\" nhận \"TIÊN ĐAN\", nhận thêm +4/+4, Sau khi nhận 24 \"TIÊN ĐAN\", biến thành \"TÔN NGỘ KHÔNG\" lv1 (giữ nguyên chỉ số \"SÁT THƯƠNG\"/\"MÁU\" hiện tại)"],"id":87,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"THỔ ĐỊA","t":"SHENZHOU","c":2,"sum":false,"s":[[3,2],[6,4],[12,8]],"k":["\"HÀO QUANG\": Tăng \"THU NHẬP\" của ngươi thêm 1 (Tăng thêm 1 sau mỗi 3 lượt)","\"HÀO QUANG\": Tăng \"THU NHẬP\" của ngươi thêm 2 (Tăng thêm 2 sau mỗi 3 lượt)","\"HÀO QUANG\": Tăng \"THU NHẬP\" của ngươi thêm 4 (Tăng thêm 4 sau mỗi 3 lượt)"],"id":88,"tags":["KINHTE"],"kw":["HÀO QUANG"],"fx":[[],[],[]]},{"n":"TỲ BÀ TINH","t":"SHENZHOU","c":2,"sum":false,"s":[[1,3],[2,6],[4,12]],"k":["\"KHIÊU KHÍCH\": Bất cứ khi nào \"TỲ BÀ TINH\" này nhận sát thương, nhận 1 \"TIÊN ĐAN\" CẤP 1 (3 lần trong chiến đấu)","\"KHIÊU KHÍCH\": Bất cứ khi nào \"TỲ BÀ TINH\" này nhận sát thương, nhận 1 \"TIÊN ĐAN\" CẤP 2 (3 lần trong chiến đấu)","\"KHIÊU KHÍCH\": Bất cứ khi nào \"TỲ BÀ TINH\" này nhận sát thương, nhận 1 \"TIÊN ĐAN\" CẤP 2 (6 lần trong chiến đấu)"],"id":89,"tags":["TIENDAN","NHANST"],"kw":["KHIÊU KHÍCH"],"fx":[[],[],[]]},{"n":"SEN HỒNG TỬ","t":"SHENZHOU","c":1,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["\"TRIỂN KHAI\": Nhận 1 \"BỘI LỰC ĐAN\" và 1 \"DIÊN THỌ ĐAN\"","\"TRIỂN KHAI\": Nhận 2 \"THÁI CỰC ĐAN\"","\"TRIỂN KHAI\": Nhận 4 \"THÁI CỰC ĐAN\""],"id":90,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"PHI PHI","t":"SHENZHOU","c":1,"sum":false,"s":[[3,2],[6,4],[12,8]],"k":["\"LUYỆN ĐAN(1)\" Nhận 1 \"DIÊN THỌ ĐAN\"","\"LUYỆN ĐAN(2)\" Nhận 2 \"DIÊN THỌ ĐAN\"","\"LUYỆN ĐAN(3)\" Nhận 3 \"DIÊN THỌ ĐAN\""],"id":91,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"BẠCH TRẠCH","t":"SHENZHOU","c":1,"sum":false,"s":[[2,3],[4,6],[8,12]],"k":["\"LUYỆN ĐAN(1)\" Nhận 1 \"BỘI LỰC ĐAN\"","\"LUYỆN ĐAN(2)\" Nhận 2 \"BỘI LỰC ĐAN\"","\"LUYỆN ĐAN(3)\" Nhận 3 \"BỘI LỰC ĐAN\""],"id":92,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"HẠO THIÊN KHUYỂN","t":"SHENZHOU","c":0,"sum":true,"s":[[7,7],[14,14],[28,28]],"k":["\"TRIỂN KHAI\": Cho mỗi đồng minh SHENZHOU (ngoại trừ bản thân) trên sân một \"TIÊN ĐAN\" ngẫu nhiên (1 lần)","\"TRIỂN KHAI\": Cho mỗi đồng minh SHENZHOU (ngoại trừ bản thân) trên sân một \"TIÊN ĐAN\" ngẫu nhiên (2 lần)","\"TRIỂN KHAI\": Cho mỗi đồng minh SHENZHOU (ngoại trừ bản thân) trên sân một \"TIÊN ĐAN\" ngẫu nhiên (4 lần)"],"id":93,"tags":["TIENDAN"],"kw":[],"fx":[[],[],[]]},{"n":"ERESKIGAL","t":"BABYLON","c":6,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["Khi ngươi bán 1 đơn vị BABYLON, \"HẤP THỤ\" đơn vị đó (2 lần mỗi lượt)","Khi ngươi bán 1 đơn vị BABYLON, \"HẤP THỤ\" đơn vị đó (4 lần mỗi lượt)","Khi ngươi bán 1 đơn vị BABYLON, \"HẤP THỤ\" đơn vị đó"],"id":94,"tags":["HAPTHU","MUABAN","ABSORBT"],"kw":[],"fx":[[],[],[]]},{"n":"NIRURTA","t":"BABYLON","c":6,"sum":false,"s":[[9,9],[18,18],[36,36]],"k":["Sau khi ngươi triển khai 3 đơn vị, tăng \"THU NHẬP\" của ngươi thêm 1 cho đến lượt sau","Sau khi ngươi triển khai 3 đơn vị, tăng \"THU NHẬP\" của ngươi thêm 2 cho đến lượt sau","Sau khi ngươi triển khai 3 đơn vị, tăng \"THU NHẬP\" của ngươi thêm 4 cho đến lượt sau"],"id":95,"tags":["TRIENKHAI","KINHTE"],"kw":[],"fx":[[],[],[]]},{"n":"UTU","t":"BABYLON","c":6,"sum":false,"s":[[6,6],[12,12],[24,24]],"k":["Sau khi ngươi triển khai 1 đơn vị BABYLON, cho tất cả đồng minh +1/+1 (Tăng thêm +1/+1 sau khi ngươi triển khai 5 đơn vị BABYLON - Hiệu ứng này có thể cộng dồn)","Sau khi ngươi triển khai 1 đơn vị BABYLON, cho tất cả đồng minh +1/+1 (Tăng thêm +2/+2 sau khi ngươi triển khai 5 đơn vị BABYLON - Hiệu ứng này có thể cộng dồn)","Sau khi ngươi triển khai 1 đơn vị BABYLON, cho tất cả đồng minh +1/+1 (Tăng thêm +4/+4 sau khi ngươi triển khai 5 đơn vị BABYLON - Hiệu ứng này có thể cộng dồn)"],"id":96,"tags":["TRIENKHAI"],"kw":[],"fx":[[{"tr":"OTHER","a":1,"h":1,"lim":0,"tg":"allies"}],[{"tr":"OTHER","a":1,"h":1,"lim":0,"tg":"allies"}],[{"tr":"OTHER","a":1,"h":1,"lim":0,"tg":"allies"}]]},{"n":"NANNA","t":"BABYLON","c":5,"sum":false,"s":[[8,8],[16,16],[32,32]],"k":["Khi ngươi bán đơn vị này, chuyển chỉ số của nó cho 1 đồng minh BABYLON ngẫu nhiên trên sân","Khi ngươi bán đơn vị này, chuyển chỉ số của nó cho 2 đồng minh BABYLON ngẫu nhiên trên sân","Khi ngươi bán đơn vị này, chuyển chỉ số của nó cho 3 đồng minh BABYLON ngẫu nhiên trên sân"],"id":97,"tags":["MUABAN"],"kw":[],"fx":[[],[],[]]},{"n":"ASHUR","t":"BABYLON","c":5,"sum":false,"s":[[6,6],[12,12],[24,24]],"k":["Bất cứ khi nào ngươi mua một đơn vị, cho tất cả đồng minh trên sân +2 \"SÁT THƯƠNG\". Bất cứ khi nào ngươi bán một đơn vị, cho tất cả đồng minh trên sân +2 \"MÁU\"","Bất cứ khi nào ngươi mua một đơn vị, cho tất cả đồng minh trên sân +4 \"SÁT THƯƠNG\". Bất cứ khi nào ngươi bán một đơn vị, cho tất cả đồng minh trên sân +4 \"MÁU\"","Bất cứ khi nào ngươi mua một đơn vị, cho tất cả đồng minh trên sân +8 \"SÁT THƯƠNG\". Bất cứ khi nào ngươi bán một đơn vị, cho tất cả đồng minh trên sân +8 \"MÁU\""],"id":98,"tags":["MUABAN"],"kw":[],"fx":[[{"tr":"OTHER","a":2,"h":2,"lim":0,"tg":"allies"}],[{"tr":"OTHER","a":4,"h":4,"lim":0,"tg":"allies"}],[{"tr":"OTHER","a":8,"h":8,"lim":0,"tg":"allies"}]]},{"n":"ENKI","t":"BABYLON","c":5,"sum":false,"s":[[7,7],[14,14],[28,28]],"k":["Bất cứ khi nào ngươi triển khai một đơn vị BABYLON, cho một đồng minh +1/+1 \"VĨNH VIỄN\". Lặp lại với mỗi đơn vị được triển khai trong lượt này","Bất cứ khi nào ngươi triển khai một đơn vị BABYLON, cho một đồng minh +2/+2 \"VĨNH VIỄN\". Lặp lại với mỗi đơn vị được triển khai trong lượt này","Bất cứ khi nào ngươi triển khai một đơn vị BABYLON, cho một đồng minh +4/+4 \"VĨNH VIỄN\". Lặp lại với mỗi đơn vị được triển khai trong lượt này"],"id":99,"tags":["TRIENKHAI"],"kw":[],"fx":[[{"tr":"OTHER","a":1,"h":1,"lim":0,"tg":"ally"}],[{"tr":"OTHER","a":2,"h":2,"lim":0,"tg":"ally"}],[{"tr":"OTHER","a":4,"h":4,"lim":0,"tg":"ally"}]]},{"n":"KI","t":"BABYLON","c":5,"sum":false,"s":[[6,6],[12,12],[24,24]],"k":["Bất cứ khi nào ngươi triển khai một đơn vị BABYLON, cho đơn vị đó +3/+3 (tăng thêm +2/+2 cho mỗi đơn vị được triển khai trong lượt này)","Bất cứ khi nào ngươi triển khai một đơn vị BABYLON, cho đơn vị đó +3/+3 (tăng thêm +4/+4 cho mỗi đơn vị được triển khai trong lượt này)","Bất cứ khi nào ngươi triển khai một đơn vị BABYLON, cho đơn vị đó +3/+3 (tăng thêm +8/+8 cho mỗi đơn vị được triển khai trong lượt này)"],"id":100,"tags":["TRIENKHAI"],"kw":[],"fx":[[],[],[]]},{"n":"GUGALANA","t":"BABYLON","c":4,"sum":false,"s":[[5,5],[10,10],[20,20]],"k":["\"KHIÊU KHÍCH\": Sau khi ngươi triển khai đơn vị này, tăng chỉ số của nó lên gấp đôi","\"KHIÊU KHÍCH\" - \"LÁ CHẮN\": Sau khi ngươi triển khai đơn vị này, tăng chỉ số của nó lên gấp đôi","\"KHIÊU KHÍCH\" - \"LÁ CHẮN\": Sau khi ngươi triển khai đơn vị này, tăng chỉ số của nó lên gấp ba"],"id":101,"tags":["LACHAN","TRIENKHAI"],"kw":["KHIÊU KHÍCH","LÁ CHẮN"],"fx":[[],[],[]]},{"n":"UMU DRABUTU","t":"BABYLON","c":4,"sum":false,"s":[[5,5],[10,10],[20,20]],"k":["\"TRIỂN KHAI\": Nhận 1 đơn vị BABYLON ngẫu nhiên khác (thấp hơn hoặc bằng cấp THÁNH ĐỀN)","\"TRIỂN KHAI\": Nhận 2 đơn vị BABYLON ngẫu nhiên khác (thấp hơn hoặc bằng cấp THÁNH ĐỀN)","\"TRIỂN KHAI\": Nhận 3 đơn vị BABYLON ngẫu nhiên khác (thấp hơn hoặc bằng cấp THÁNH ĐỀN)"],"id":102,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"ENKIDU","t":"BABYLON","c":4,"sum":false,"s":[[5,5],[10,10],[20,20]],"k":["Sau khi ngươi triển khai một đơn vị BABYLON, cho đơn vị này và đồng minh bên trái +1/+1","Sau khi ngươi triển khai một đơn vị BABYLON, cho đơn vị này và đồng minh bên trái +2/+2","Sau khi ngươi triển khai một đơn vị BABYLON, cho đơn vị này và đồng minh bên trái +4/+4"],"id":103,"tags":["TRIENKHAI"],"kw":[],"fx":[[{"tr":"OTHER","a":1,"h":1,"lim":0,"tg":"ally"}],[{"tr":"OTHER","a":2,"h":2,"lim":0,"tg":"ally"}],[{"tr":"OTHER","a":4,"h":4,"lim":0,"tg":"ally"}]]},{"n":"GILGAMESH","t":"BABYLON","c":4,"sum":false,"s":[[6,6],[12,12],[24,24]],"k":["\"LÁ CHẮN\" - \"LIÊN KÍCH\": Bất cứ khi nào đơn vị này được tăng chỉ số, nhận thêm +2/+1 vào chỉ số bản thân","\"LÁ CHẮN\" - \"LIÊN KÍCH\": Bất cứ khi nào đơn vị này được tăng chỉ số, nhận thêm +4/+2 vào chỉ số bản thân","\"LÁ CHẮN\" - \"LIÊN KÍCH\": Bất cứ khi nào đơn vị này được tăng chỉ số, nhận thêm +8/+4 vào chỉ số bản thân"],"id":104,"tags":["LACHAN"],"kw":["LIÊN KÍCH","LÁ CHẮN"],"fx":[[],[],[]]},{"n":"HUMBABA","t":"BABYLON","c":4,"sum":false,"s":[[7,1],[14,2],[28,4]],"k":["\"TẦM XA\" - \"KẾT LIỄU(1)\": Nhận 1 đơn vị BABYLON ngẫu nhiên","\"TẦM XA\" - \"KẾT LIỄU(1)\": Nhận 2 đơn vị BABYLON ngẫu nhiên","\"TẦM XA\" - \"KẾT LIỄU(1)\": Nhận 3 đơn vị BABYLON ngẫu nhiên"],"id":105,"tags":["KETLIEU"],"kw":["TẦM XA"],"fx":[[],[],[]]},{"n":"ASAG","t":"BABYLON","c":4,"sum":false,"s":[[1,1],[2,2],[4,4]],"k":["\"TRIỂN KHAI\": Chọn tối đa 2 đồng minh BABYLON để \"HẤP THỤ\"","\"TRIỂN KHAI\": Chọn tối đa 3 đồng minh BABYLON để \"HẤP THỤ\"","\"TRIỂN KHAI\": Chọn tối đa 3 đồng minh BABYLON để \"HẤP THỤ\" và nhận gấp đôi chỉ số của chúng"],"id":106,"tags":["HAPTHU","ABSORBT"],"kw":[],"fx":[[],[],[]]},{"n":"USUMGALLU","t":"BABYLON","c":3,"sum":false,"s":[[3,1],[6,2],[12,4]],"k":["\"TRIỂN KHAI\": Đổi lại \"THÁNH ĐỀN\" bằng các đơn vị BABYLON và cho chúng +2/+2","\"TRIỂN KHAI\": Đổi lại \"THÁNH ĐỀN\" bằng các đơn vị BABYLON và cho chúng +4/+4","\"TRIỂN KHAI\": Đổi lại \"THÁNH ĐỀN\" bằng các đơn vị BABYLON và cho chúng +8/+8"],"id":107,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"LAMASHTU","t":"BABYLON","c":3,"sum":false,"s":[[5,1],[10,2],[20,4]],"k":["Khi ngươi bán 1 đơn vị BABYLON, \"LAMASHTU\" nhận \"MÁU\" của đơn vị đó (1 lần mỗi lượt)","Khi ngươi bán 1 đơn vị BABYLON, \"LAMASHTU\" nhận \"MÁU\" của đơn vị đó (2 lần mỗi lượt)","Khi ngươi bán 1 đơn vị BABYLON, \"LAMASHTU\" nhận \"MÁU\" của đơn vị đó (4 lần mỗi lượt)"],"id":108,"tags":["MUABAN"],"kw":[],"fx":[[],[],[]]},{"n":"PAZUZU","t":"BABYLON","c":3,"sum":false,"s":[[5,2],[10,4],[20,8]],"k":["\"TRIỂN KHAI\": Nhận 2 lượt \"ĐỔI LẠI\" miễn phí","\"TRIỂN KHAI\": Nhận 4 lượt \"ĐỔI LẠI\" miễn phí","\"TRIỂN KHAI\": Nhận 6 lượt \"ĐỔI LẠI\" miễn phí"],"id":109,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"KINGU","t":"BABYLON","c":3,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["Khi ngươi bán đơn vị này, nhận 1 \"PHIẾN ĐÁ SỐ PHẬN\"","Khi ngươi bán đơn vị này, nhận 2 \"PHIẾN ĐÁ SỐ PHẬN\"","Khi ngươi bán đơn vị này, nhận 3 \"PHIẾN ĐÁ SỐ PHẬN\""],"id":110,"tags":["MUABAN"],"kw":[],"fx":[[],[],[]]},{"n":"CUNG THỦ BABYLON","t":"BABYLON","c":2,"sum":false,"s":[[2,3],[4,6],[8,12]],"k":["Sau khi ngươi triển khai một đơn vị BABYLON, nhận +1 \"SÁT THƯƠNG\" và \"TẦM XA\" cho đến lượt sau","Sau khi ngươi triển khai một đơn vị BABYLON, nhận +2 \"SÁT THƯƠNG\" và \"TẦM XA\" cho đến lượt sau","Sau khi ngươi triển khai một đơn vị BABYLON, nhận +4 \"SÁT THƯƠNG\" và \"TẦM XA\" cho đến lượt sau"],"id":111,"tags":["TRIENKHAI"],"kw":["TẦM XA"],"fx":[[{"tr":"OTHER","a":1,"h":0,"lim":0,"tg":"self"}],[{"tr":"OTHER","a":2,"h":0,"lim":0,"tg":"self"}],[{"tr":"OTHER","a":4,"h":0,"lim":0,"tg":"self"}]]},{"n":"URIDIMMU","t":"BABYLON","c":2,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["Bất cứ khi nào ngươi triển khai một đơn vị BABYLON, cho đơn vị đó và \"URIDIMMU\" này +1 \"SÁT THƯƠNG\"","Bất cứ khi nào ngươi triển khai một đơn vị BABYLON, cho đơn vị đó và \"URIDIMMU\" này +2 \"SÁT THƯƠNG\"","Bất cứ khi nào ngươi triển khai một đơn vị BABYLON, cho đơn vị đó và \"URIDIMMU\" này +4 \"SÁT THƯƠNG\""],"id":112,"tags":["TRIENKHAI"],"kw":[],"fx":[[],[],[]]},{"n":"UGALLU","t":"BABYLON","c":2,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["Khi ngươi bán \"UGALLU\" này, nhận 1 đơn vị BABYLON ngẫu nhiên (Thấp hơn hoặc bằng cấp \"THÁNH ĐỀN\")","Khi ngươi bán \"UGALLU\" này, nhận 2 đơn vị BABYLON ngẫu nhiên (Thấp hơn hoặc bằng cấp \"THÁNH ĐỀN\")","Khi ngươi bán \"UGALLU\" này, nhận 3 đơn vị BABYLON ngẫu nhiên (Thấp hơn hoặc bằng cấp \"THÁNH ĐỀN\")"],"id":113,"tags":["MUABAN"],"kw":[],"fx":[[],[],[]]},{"n":"HỌC GIẢ SUMER","t":"BABYLON","c":1,"sum":false,"s":[[3,2],[6,4],[12,8]],"k":["\"TRIỂN KHAI\": Giảm giá tiền nâng cấp \"THÁNH ĐỀN\" đi 1","\"TRIỂN KHAI\": Giảm giá tiền nâng cấp \"THÁNH ĐỀN\" đi 2","\"TRIỂN KHAI\": Giảm giá tiền nâng cấp \"THÁNH ĐỀN\" đi 4"],"id":114,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"BINH LÍNH BABYLON","t":"BABYLON","c":1,"sum":false,"s":[[2,4],[4,8],[8,16]],"k":["Sau khi ngươi triển khai một đơn vị BABYLON, \"BINH LÍNH BABYLON\" trên sân nhận +1 \"MÁU\"","Sau khi ngươi triển khai một đơn vị BABYLON, \"BINH LÍNH BABYLON\" trên sân nhận +2 \"MÁU\"","Sau khi ngươi triển khai một đơn vị BABYLON, \"BINH LÍNH BABYLON\" trên sân nhận +4 \"MÁU\""],"id":115,"tags":["TRIENKHAI"],"kw":[],"fx":[[{"tr":"OTHER","a":0,"h":1,"lim":0,"tg":"self"}],[{"tr":"OTHER","a":0,"h":2,"lim":0,"tg":"self"}],[{"tr":"OTHER","a":0,"h":4,"lim":0,"tg":"self"}]]},{"n":"KUSARIKKU","t":"BABYLON","c":1,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["Bất cứ khi nào ngươi bán một đơn vị, \"KUSARIKKU\" trên sân nhận +1/+1","Bất cứ khi nào ngươi bán một đơn vị, \"KUSARIKKU\" trên sân nhận +2/+2","Bất cứ khi nào ngươi bán một đơn vị, \"KUSARIKKU\" trên sân nhận +4/+4"],"id":116,"tags":["MUABAN"],"kw":[],"fx":[[{"tr":"OTHER","a":1,"h":1,"lim":0,"tg":"self"}],[{"tr":"OTHER","a":2,"h":2,"lim":0,"tg":"self"}],[{"tr":"OTHER","a":4,"h":4,"lim":0,"tg":"self"}]]},{"n":"HACHIMAN","t":"KAMI","c":6,"sum":false,"s":[[3,9],[6,18],[12,36]],"k":["\"TẤN CÔNG\": Gây 8 sát thương lên mục tiêu, lặp lại X lần (Tăng +1 số lần lặp lại sau khi một đồng minh khác gây sát thương, bắt đầu từ 1)","\"TẤN CÔNG\": Gây 16 sát thương lên mục tiêu, lặp lại X lần (Tăng +1 số lần lặp lại sau khi một đồng minh khác gây sát thương, bắt đầu từ 1)","\"TẤN CÔNG\": Gây 32 sát thương lên mục tiêu, lặp lại X lần (Tăng +1 số lần lặp lại sau khi một đồng minh khác gây sát thương, bắt đầu từ 1)"],"id":117,"tags":["GAYST"],"kw":[],"fx":[[],[],[]]},{"n":"RYUJIN","t":"KAMI","c":6,"sum":false,"s":[[8,8],[16,16],[32,32]],"k":["Bất cứ khi nào một đồng minh KAMI gây sát thương, cho mọi đồng minh +4 \"SÁT THƯƠNG\" \"VĨNH VIỄN\" (Đổi \"SÁT THƯƠNG\"/\"Máu\" mỗi lần kích hoạt)","Bất cứ khi nào một đồng minh KAMI gây sát thương, cho mọi đồng minh +8 \"SÁT THƯƠNG\" \"VĨNH VIỄN\" (Đổi \"SÁT THƯƠNG\"/\"Máu\" mỗi lần kích hoạt)","Bất cứ khi nào một đồng minh KAMI gây sát thương, cho mọi đồng minh +16 \"SÁT THƯƠNG\" \"VĨNH VIỄN\" (Đổi \"SÁT THƯƠNG\"/\"Máu\" mỗi lần kích hoạt)"],"id":118,"tags":["GAYST"],"kw":[],"fx":[[{"tr":"DMG","a":4,"h":0,"lim":0,"tg":"ally"}],[{"tr":"DMG","a":8,"h":0,"lim":0,"tg":"ally"}],[{"tr":"DMG","a":16,"h":0,"lim":0,"tg":"ally"}]]},{"n":"SUSANOO","t":"KAMI","c":6,"sum":false,"s":[[9,8],[18,16],[36,32]],"k":["\"HIỂM ĐỘC\"-\"KẾT LIỄU(1)\": Cho 1 đồng minh KAMI ngẫu nhiên \"HIỂM ĐỘC\"","\"HIỂM ĐỘC\"-\"KẾT LIỄU(1)\": Cho 2 đồng minh KAMI ngẫu nhiên \"HIỂM ĐỘC\"","\"HIỂM ĐỘC\"-\"KẾT LIỄU(1)\": Cho 3 đồng minh KAMI ngẫu nhiên \"HIỂM ĐỘC\""],"id":119,"tags":["KETLIEU"],"kw":["HIỂM ĐỘC"],"fx":[[],[],[]]},{"n":"SARUTAHIKO","t":"KAMI","c":5,"sum":false,"s":[[5,6],[10,12],[20,24]],"k":["\"ẨN THÂN\": Bất cứ khi nào một đồng minh tấn công, cho tất cả đồng minh +1 \"SÁT THƯƠNG\" \"VĨNH VIỄN\". Đồng minh có \"ẨN THÂN\" thì nhận +2/+2","\"ẨN THÂN\": Bất cứ khi nào một đồng minh tấn công, cho tất cả đồng minh +2 \"SÁT THƯƠNG\" \"VĨNH VIỄN\". Đồng minh có \"ẨN THÂN\" thì nhận +4/+4","\"ẨN THÂN\": Bất cứ khi nào một đồng minh tấn công, cho tất cả đồng minh +4 \"SÁT THƯƠNG\" \"VĨNH VIỄN\". Đồng minh có \"ẨN THÂN\" thì nhận +8/+8"],"id":120,"tags":["ANTHAN"],"kw":["ẨN THÂN"],"fx":[[{"tr":"ATK","a":2,"h":2,"lim":0,"tg":"self"}],[{"tr":"ATK","a":4,"h":4,"lim":0,"tg":"self"}],[{"tr":"ATK","a":8,"h":8,"lim":0,"tg":"self"}]]},{"n":"RAIJIN","t":"KAMI","c":5,"sum":false,"s":[[8,3],[16,6],[32,12]],"k":["\"KHÔNG THỂ TẤN CÔNG\": Khi đồng minh KAMI tấn công, \"RAIJIN\" gây sát thương lên mục tiêu bằng với chỉ số \"SÁT THƯƠNG\" của nó (2 lần trong chiến đấu)","\"KHÔNG THỂ TẤN CÔNG\": Khi đồng minh KAMI tấn công, \"RAIJIN\" gây sát thương lên mục tiêu bằng với chỉ số \"SÁT THƯƠNG\" của nó (4 lần trong chiến đấu)","\"KHÔNG THỂ TẤN CÔNG\": Khi đồng minh KAMI tấn công, \"RAIJIN\" gây sát thương lên mục tiêu bằng với chỉ số \"SÁT THƯƠNG\" của nó"],"id":121,"tags":["GAYST"],"kw":["KHÔNG THỂ TẤN CÔNG"],"fx":[[],[],[]]},{"n":"FUJIN","t":"KAMI","c":5,"sum":false,"s":[[5,5],[10,10],[20,20]],"k":["\"KHAI TRẬN\": Cho mọi đồng minh KAMI bên cạnh +5/+5 \"VĨNH VIỄN\" và \"LIÊN KÍCH\"","\"KHAI TRẬN\": Cho mọi đồng minh KAMI liền kề +5/+5 \"VĨNH VIỄN\" và \"LIÊN KÍCH\"","\"KHAI TRẬN\": Cho tất cả đồng minh KAMI +5/+5 \"VĨNH VIỄN\" và \"LIÊN KÍCH\""],"id":122,"tags":[],"kw":["LIÊN KÍCH"],"fx":[[{"tr":"OPEN","a":5,"h":5,"lim":0,"tg":"ally"}],[{"tr":"OPEN","a":5,"h":5,"lim":0,"tg":"ally"}],[{"tr":"OPEN","a":5,"h":5,"lim":0,"tg":"allies"}]]},{"n":"AME NO UZUME","t":"KAMI","c":5,"sum":false,"s":[[2,10],[4,20],[8,40]],"k":["\"ẨN THÂN\": Bất cứ khi nào một đồng minh mất \"ẨN THÂN\", cho tất cả đồng minh khác +2/+1 \"VĨNH VIỄN\"","\"ẨN THÂN\": Bất cứ khi nào một đồng minh mất \"ẨN THÂN\", cho tất cả đồng minh khác +4/+2 \"VĨNH VIỄN\"","\"ẨN THÂN\": Bất cứ khi nào một đồng minh mất \"ẨN THÂN\", cho tất cả đồng minh khác +8/+4 \"VĨNH VIỄN\""],"id":123,"tags":["ANTHAN"],"kw":["ẨN THÂN"],"fx":[[{"tr":"ATK","a":2,"h":1,"lim":0,"tg":"allies"}],[{"tr":"ATK","a":4,"h":2,"lim":0,"tg":"allies"}],[{"tr":"ATK","a":8,"h":4,"lim":0,"tg":"allies"}]]},{"n":"FUTAKUCHI ONNA","t":"KAMI","c":4,"sum":false,"s":[[6,6],[12,12],[24,24]],"k":["\"TẤN CÔNG\": Nếu đơn vị này đang \"ẨN THÂN\", gây sát thương bằng với \"SÁT THƯƠNG\" của \"FUTAKUCHI ONNA\" lên một kẻ địch bên cạnh mục tiêu","\"TẤN CÔNG\": Nếu đơn vị này đang \"ẨN THÂN\", gây sát thương bằng với \"SÁT THƯƠNG\" của \"FUTAKUCHI ONNA\" lên mọi kẻ địch bên cạnh mục tiêu","\"TẤN CÔNG\": Nếu đơn vị này đang \"ẨN THÂN\", gây sát thương bằng với \"SÁT THƯƠNG\" của \"FUTAKUCHI ONNA\" lên mọi kẻ địch liền kề mục tiêu"],"id":124,"tags":["ANTHAN","GAYST"],"kw":["ẨN THÂN"],"fx":[[],[],[]]},{"n":"HANADAKA TENGU","t":"KAMI","c":4,"sum":false,"s":[[1,6],[2,12],[4,24]],"k":["\"ẨN THÂN\": Bất cứ khi nào một đồng minh tấn công, cho một đồng minh khác +2/+2 \"VĨNH VIỄN\" và \"ẨN THÂN\"","\"ẨN THÂN\": Bất cứ khi nào một đồng minh tấn công, cho một đồng minh khác +4/+4 \"VĨNH VIỄN\" và \"ẨN THÂN\"","\"ẨN THÂN\": Bất cứ khi nào một đồng minh tấn công, cho một đồng minh khác +8/+8 \"VĨNH VIỄN\" và \"ẨN THÂN\""],"id":125,"tags":["ANTHAN"],"kw":["ẨN THÂN"],"fx":[[{"tr":"ATK","a":2,"h":2,"lim":0,"tg":"ally"}],[{"tr":"ATK","a":4,"h":4,"lim":0,"tg":"ally"}],[{"tr":"ATK","a":8,"h":8,"lim":0,"tg":"ally"}]]},{"n":"NEKOMATA","t":"KAMI","c":4,"sum":false,"s":[[1,9],[2,18],[4,36]],"k":["\"KHAI TRẬN\": Gây 4 sát thương lên kẻ địch đối diện sau đó cho nó \"LÁ CHẮN\" và \"SUY YẾU\"","\"KHAI TRẬN\": Gây 8 sát thương lên kẻ địch đối diện sau đó cho nó \"LÁ CHẮN\" và \"SUY YẾU\"","\"KHAI TRẬN\": Gây 16 sát thương lên kẻ địch đối diện sau đó cho nó \"LÁ CHẮN\" và \"SUY YẾU\""],"id":126,"tags":["LACHAN"],"kw":["LÁ CHẮN"],"fx":[[],[],[]]},{"n":"UMIBOZU","t":"KAMI","c":4,"sum":false,"s":[[7,7],[14,14],[28,28]],"k":["\"ẨN THÂN\"-\"KẾT LIỄU(1): Nhận +2/+2 \"VĨNH VIỄN\" và \"ẨN THÂN\"","\"ẨN THÂN\"-\"KẾT LIỄU(1): Nhận +4/+4 \"VĨNH VIỄN\" và \"ẨN THÂN\"","\"ẨN THÂN\"-\"KẾT LIỄU(1): Nhận +8/+8 \"VĨNH VIỄN\" và \"ẨN THÂN\""],"id":127,"tags":["ANTHAN","KETLIEU"],"kw":["ẨN THÂN"],"fx":[[{"tr":"KILL","a":2,"h":2,"lim":0,"tg":"self"}],[{"tr":"KILL","a":4,"h":4,"lim":0,"tg":"self"}],[{"tr":"KILL","a":8,"h":8,"lim":0,"tg":"self"}]]},{"n":"ODOKURO","t":"KAMI","c":4,"sum":false,"s":[[4,6],[8,12],[16,24]],"k":["Sau khi một đồng minh KAMI gây sát thương nhận +2/+1 \"VĨNH VIỄN\"","Sau khi một đồng minh KAMI gây sát thương nhận +4/+2 \"VĨNH VIỄN\"","Sau khi một đồng minh KAMI gây sát thương nhận +8/+4 \"VĨNH VIỄN\""],"id":128,"tags":["GAYST"],"kw":[],"fx":[[{"tr":"DMG","a":2,"h":1,"lim":0,"tg":"self"}],[{"tr":"DMG","a":4,"h":2,"lim":0,"tg":"self"}],[{"tr":"DMG","a":8,"h":4,"lim":0,"tg":"self"}]]},{"n":"NAMAHAGE","t":"KAMI","c":3,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["Sau khi một đồng minh KAMI gây sát thương, cho các đồng minh KAMI khác +1 \"SÁT THƯƠNG\"","Sau khi một đồng minh KAMI gây sát thương, cho các đồng minh KAMI khác +2 \"SÁT THƯƠNG\"","Sau khi một đồng minh KAMI gây sát thương, cho các đồng minh KAMI khác +4 \"SÁT THƯƠNG\""],"id":129,"tags":["GAYST"],"kw":[],"fx":[[{"tr":"DMG","a":1,"h":0,"lim":0,"tg":"ally"}],[{"tr":"DMG","a":2,"h":0,"lim":0,"tg":"ally"}],[{"tr":"DMG","a":4,"h":0,"lim":0,"tg":"ally"}]]},{"n":"TANUKI","t":"KAMI","c":3,"sum":false,"s":[[1,1],[2,2],[4,4]],"k":["\"TÁI SINH\"-\"LÁ CHẮN\": Bất cứ khi nào một đồng minh KAMI khác tấn công, cho tất cả đồng minh đang \"ẨN THÂN\" +2/+1 \"VĨNH VIỄN\"","\"TÁI SINH\"-\"LÁ CHẮN\": Bất cứ khi nào một đồng minh KAMI khác tấn công, cho tất cả đồng minh đang \"ẨN THÂN\" +4/+2 \"VĨNH VIỄN\"","\"TÁI SINH\"-\"LÁ CHẮN\": Bất cứ khi nào một đồng minh KAMI khác tấn công, cho tất cả đồng minh đang \"ẨN THÂN\" +8/+4 \"VĨNH VIỄN\""],"id":130,"tags":["TAISINH","LACHAN","ANTHAN"],"kw":["LÁ CHẮN","ẨN THÂN"],"fx":[[{"tr":"REB","a":2,"h":1,"lim":0,"tg":"allies"}],[{"tr":"REB","a":4,"h":2,"lim":0,"tg":"allies"}],[{"tr":"REB","a":8,"h":4,"lim":0,"tg":"allies"}]]},{"n":"TESSO","t":"KAMI","c":3,"sum":false,"s":[[6,1],[12,2],[24,4]],"k":["\"TỬ VONG\": Gây 4 sát thương lên kẻ địch có \"MÁU\" cao nhất","\"TỬ VONG\": Gây 8 sát thương lên kẻ địch có \"MÁU\" cao nhất","\"TỬ VONG\": Gây 16 sát thương lên kẻ địch có \"MÁU\" cao nhất"],"id":131,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"YUKI ONNA","t":"KAMI","c":3,"sum":false,"s":[[1,8],[2,16],[4,32]],"k":["\"KHIÊU KHÍCH\": Bất cứ khi nào đơn vị này bị tấn công, gây 4 sát thương lên kẻ tấn công và cho đơn vị này \"ẨN THÂN\"","\"KHIÊU KHÍCH\": Bất cứ khi nào đơn vị này bị tấn công, gây 4 sát thương lên kẻ tấn công 2 lần và cho đơn vị này \"ẨN THÂN\"","\"KHIÊU KHÍCH\": Bất cứ khi nào đơn vị này bị tấn công, gây 4 sát thương lên kẻ tấn công 3 lần và cho đơn vị này \"ẨN THÂN\""],"id":132,"tags":["ANTHAN"],"kw":["KHIÊU KHÍCH","ẨN THÂN"],"fx":[[],[],[]]},{"n":"JIMENJU","t":"KAMI","c":3,"sum":false,"s":[[1,5],[2,10],[4,20]],"k":["\"TRIỂN KHAI\": Chọn 1 đồng minh KAMI, cho đồng minh đó \"ẨN THÂN\". Nếu đã có \"ẨN THÂN\", cho \"HIỂM ĐỘC\" (\"VĨNH VIỄN\")","\"TRIỂN KHAI\": Chọn 2 đồng minh KAMI, cho đồng minh đó \"ẨN THÂN\". Nếu đã có \"ẨN THÂN\", cho \"HIỂM ĐỘC\" (\"VĨNH VIỄN\")","\"TRIỂN KHAI\": Chọn 3 đồng minh KAMI, cho đồng minh đó \"ẨN THÂN\". Nếu đã có \"ẨN THÂN\", cho \"HIỂM ĐỘC\" (\"VĨNH VIỄN\")"],"id":133,"tags":["ANTHAN"],"kw":["HIỂM ĐỘC","ẨN THÂN"],"fx":[[],[],[]]},{"n":"KARASU TENGU","t":"KAMI","c":3,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["Bất cứ khi nào một đồng minh KAMI tấn công, gây 2 sát thương lên kẻ địch nhiều \"Máu\" nhất","Bất cứ khi nào một đồng minh KAMI tấn công, gây 2 sát thương lên kẻ địch nhiều \"Máu\" nhất, 2 lần","Bất cứ khi nào một đồng minh KAMI tấn công, gây 4 sát thương lên kẻ địch nhiều \"Máu\" nhất, 3 lần"],"id":134,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"NURIKABE","t":"KAMI","c":2,"sum":false,"s":[[3,6],[6,12],[12,24]],"k":["\"KHÔNG THỂ TẤN CÔNG\": Bất cứ khi nào \"NURIKABE\" này bị tấn công, cho một đồng minh khác +1 \"SÁT THƯƠNG\" và \"ẨN THÂN\"","\"KHÔNG THỂ TẤN CÔNG\": Bất cứ khi nào \"NURIKABE\" này bị tấn công, cho một đồng minh khác +2 \"SÁT THƯƠNG\" và \"ẨN THÂN\"","\"KHÔNG THỂ TẤN CÔNG\": Bất cứ khi nào \"NURIKABE\" này bị tấn công, cho một đồng minh khác +3 \"SÁT THƯƠNG\" và \"ẨN THÂN\""],"id":135,"tags":["ANTHAN"],"kw":["KHÔNG THỂ TẤN CÔNG","ẨN THÂN"],"fx":[[{"tr":"ATK","a":1,"h":0,"lim":0,"tg":"ally"}],[{"tr":"ATK","a":2,"h":0,"lim":0,"tg":"ally"}],[{"tr":"ATK","a":3,"h":0,"lim":0,"tg":"ally"}]]},{"n":"WAYUDO","t":"KAMI","c":2,"sum":false,"s":[[3,6],[6,12],[12,24]],"k":["\"TỬ VONG\": Gây 1 sát thương và \"ĐỐT(4)\" tất cả kẻ địch cùng cột với \"WAYUDO\" này","\"TỬ VONG\": Gây 2 sát thương và \"ĐỐT(4)\" tất cả kẻ địch cùng cột với \"WAYUDO\" này","\"TỬ VONG\": Gây 4 sát thương và \"ĐỐT(4)\" tất cả kẻ địch cùng cột với \"WAYUDO\" này"],"id":136,"tags":["DOT"],"kw":["ĐỐT"],"fx":[[],[],[]]},{"n":"HITOSUME KOZO","t":"KAMI","c":2,"sum":false,"s":[[4,1],[8,2],[16,4]],"k":["\"TỬ VONG\": Cho mọi đồng minh KAMI \"ẨN THÂN\" và +1 \"SÁT THƯƠNG\"\"VĨNH VIỄN\"","\"TỬ VONG\": Cho mọi đồng minh KAMI \"ẨN THÂN\" và +2 \"SÁT THƯƠNG\"\"VĨNH VIỄN\"","\"TỬ VONG\": Cho mọi đồng minh KAMI \"ẨN THÂN\" và +4 \"SÁT THƯƠNG\"\"VĨNH VIỄN\""],"id":137,"tags":["ANTHAN"],"kw":["ẨN THÂN"],"fx":[[{"tr":"DIE","a":1,"h":0,"lim":0,"tg":"ally"}],[{"tr":"DIE","a":2,"h":0,"lim":0,"tg":"ally"}],[{"tr":"DIE","a":4,"h":0,"lim":0,"tg":"ally"}]]},{"n":"ZAKISHI WARASHI","t":"KAMI","c":2,"sum":false,"s":[[3,1],[6,2],[12,4]],"k":["Bất cứ khi nào đồng minh KAMI mất \"ẨN THÂN\", nhận 1 Vàng vào lượt sau (2 lần trong chiến đấu)","Bất cứ khi nào đồng minh KAMI mất \"ẨN THÂN\", nhận 1 Vàng vào lượt sau (4 lần trong chiến đấu)","Bất cứ khi nào đồng minh KAMI mất \"ẨN THÂN\", nhận 1 Vàng vào lượt sau (99 lần trong chiến đấu)"],"id":138,"tags":["ANTHAN","KINHTE"],"kw":["ẨN THÂN"],"fx":[[],[],[]]},{"n":"CHOCHIN-OBAKE","t":"KAMI","c":1,"sum":false,"s":[[2,3],[4,6],[8,12]],"k":["\"ẨN THÂN\": Sau khi \"CHOCHIN-OBAKE\" này mất \"ẨN THÂN\", nhận +1 \"SÁT THƯƠNG\"\"VĨNH VIỄN\"","\"ẨN THÂN\": Sau khi \"CHOCHIN-OBAKE\" này mất \"ẨN THÂN\", nhận +2 \"SÁT THƯƠNG\"\"VĨNH VIỄN\"","\"ẨN THÂN\": Sau khi \"CHOCHIN-OBAKE\" này mất \"ẨN THÂN\", nhận +4 \"SÁT THƯƠNG\"\"VĨNH VIỄN\""],"id":139,"tags":["ANTHAN"],"kw":["ẨN THÂN"],"fx":[[{"tr":"ATK","a":1,"h":0,"lim":0,"tg":"self"}],[{"tr":"ATK","a":2,"h":0,"lim":0,"tg":"self"}],[{"tr":"ATK","a":4,"h":0,"lim":0,"tg":"self"}]]},{"n":"KARA-KASA-OBAKE","t":"KAMI","c":1,"sum":false,"s":[[1,3],[2,6],[4,12]],"k":["\"TẤN CÔNG\": Gây 2 sát thương lên mục tiêu (Luôn gây cho kẻ địch 2 sát thương trước khi tấn công hoặc bị tấn công)","\"TẤN CÔNG\": Gây 4 sát thương lên mục tiêu (Luôn gây cho kẻ địch 4 sát thương trước khi tấn công hoặc bị tấn công)","\"TẤN CÔNG\": Gây 8 sát thương lên mục tiêu (Luôn gây cho kẻ địch 8 sát thương trước khi tấn công hoặc bị tấn công)"],"id":140,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"YEOMRA","t":"DAEHAN","c":6,"sum":false,"s":[[7,4],[14,8],[28,16]],"k":["\"TỬ VONG\": Triệu hồi 1 \"VONG HỒN\" với chỉ số bằng với một đơn vị ngẫu nhiên trong tay","\"TỬ VONG\": Triệu hồi 2 \"VONG HỒN\" với chỉ số bằng với một đơn vị ngẫu nhiên trong tay","\"TỬ VONG\": Triệu hồi 2 \"VONG HỒN\" với chỉ số gấp đôi  một đơn vị ngẫu nhiên trong tay"],"id":141,"tags":["TRIEUHOI"],"kw":[],"fx":[[],[],[]]},{"n":"CHEONJIWANG","t":"DAEHAN","c":6,"sum":false,"s":[[1,1],[2,2],[4,4]],"k":["\"KẾT LƯỢT\": Mỗi đồng minh DAEHAN \"HẤP THỤ\" một đơn vị trong \"THÁNH ĐỀN\", sau đó \"ĐỔI LẠI\"","\"KẾT LƯỢT\": Mỗi đồng minh DAEHAN \"HẤP THỤ\" một đơn vị trong \"THÁNH ĐỀN\", sau đó \"ĐỔI LẠI\", lặp lại 2 lần","\"KẾT LƯỢT\": Mỗi đồng minh DAEHAN \"HẤP THỤ\" một đơn vị trong \"THÁNH ĐỀN\", sau đó \"ĐỔI LẠI\", lặp lại 3 lần"],"id":142,"tags":["HAPTHU","SHOPBUFF","ABSORBT"],"kw":[],"fx":[[],[],[]]},{"n":"BARI GONGJU","t":"DAEHAN","c":6,"sum":false,"s":[[9,1],[18,2],[36,4]],"k":["\"TỬ VONG\": Nhận +4 \"SÁT THƯƠNG\" \"VĨNH VIỄN\" sau đó đưa chỉ số \"SÁT THƯƠNG\" của \"BARI GONGJU\" cho 1 đơn vị ngẫu nhiên trong tay cho đến lượt sau","\"TỬ VONG\": Nhận +8 \"SÁT THƯƠNG\" \"VĨNH VIỄN\" sau đó đưa chỉ số \"SÁT THƯƠNG\" của \"BARI GONGJU\" cho 2 đơn vị ngẫu nhiên trong tay cho đến lượt sau","\"TỬ VONG\": Nhận +16 \"SÁT THƯƠNG\" \"VĨNH VIỄN\" sau đó đưa chỉ số \"SÁT THƯƠNG\" của \"BARI GONGJU\" cho 8 đơn vị ngẫu nhiên trong tay cho đến lượt sau"],"id":143,"tags":[],"kw":[],"fx":[[{"tr":"DIE","a":4,"h":0,"lim":0,"tg":"self"}],[{"tr":"DIE","a":8,"h":0,"lim":0,"tg":"self"}],[{"tr":"DIE","a":16,"h":0,"lim":0,"tg":"self"}]]},{"n":"JACHEONGBI","t":"DAEHAN","c":5,"sum":false,"s":[[7,7],[14,14],[28,28]],"k":["Sau khi 6 đơn vị được \"Hấp thụ\" từ \"THÁNH ĐỀN\", nhận 1 đơn vị DAEHAN ngẫu nhiên lên đến CẤP 2","Sau khi 6 đơn vị được \"Hấp thụ\" từ \"THÁNH ĐỀN\", nhận 1 đơn vị DAEHAN ngẫu nhiên lên đến CẤP 3","Sau khi 6 đơn vị được \"Hấp thụ\" từ \"THÁNH ĐỀN\", nhận 2 đơn vị DAEHAN ngẫu nhiên lên đến CẤP 4"],"id":144,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"SONNIMNE","t":"DAEHAN","c":5,"sum":false,"s":[[1,1],[2,2],[4,4]],"k":["Khi ngươi bán \"SONNIMNE\" này, cho các đơn vị trong \"THÁNH ĐỀN\" trận này +1/+1 sau đó một đơn vị trong \"THÁNH ĐỀN\" hiệu ứng của \"SONNIMNE\"","Khi ngươi bán \"SONNIMNE\" này, cho các đơn vị trong \"THÁNH ĐỀN\" trận này +2/+2 sau đó một đơn vị trong \"THÁNH ĐỀN\" hiệu ứng của \"SONNIMNE\"","Khi ngươi bán \"SONNIMNE\" này, cho các đơn vị trong \"THÁNH ĐỀN\" trận này +4/+4 sau đó một đơn vị trong \"THÁNH ĐỀN\" hiệu ứng của \"SONNIMNE\""],"id":145,"tags":["MUABAN","SHOPBUFF"],"kw":[],"fx":[[],[],[]]},{"n":"DAISUNI","t":"DAEHAN","c":5,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["Sau khi ngươi triển khai một đơn vị CẤP lẻ, \"HẤP THỤ\" một đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\"","Sau khi ngươi triển khai một đơn vị CẤP lẻ, \"HẤP THỤ\" một đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\" để nhận \"Máu\" và gấp đôi \"SÁT THƯƠNG\" của đơn vị hấp thụ","Sau khi ngươi triển khai một đơn vị CẤP lẻ, \"HẤP THỤ\" một đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\" để nhận gấp đôi chỉ số của đơn vị hấp thụ"],"id":146,"tags":["HAPTHU","TRIENKHAI","SHOPBUFF"],"kw":[],"fx":[[],[],[]]},{"n":"HAESUNI","t":"DAEHAN","c":5,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["Sau khi ngươi triển khai một đơn vị CẤP chẵn, \"HẤP THỤ\" một đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\"","Sau khi ngươi triển khai một đơn vị CẤP chẵn, \"HẤP THỤ\" một đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\" để nhận \"Máu\" và gấp đôi \"SÁT THƯƠNG\" của đơn vị hấp thụ","Sau khi ngươi triển khai một đơn vị CẤP chẵn, \"HẤP THỤ\" một đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\" để nhận gấp đôi chỉ số của đơn vị hấp thụ"],"id":147,"tags":["HAPTHU","TRIENKHAI","SHOPBUFF"],"kw":[],"fx":[[],[],[]]},{"n":"IMUGI","t":"DAEHAN","c":4,"sum":false,"s":[[7,6],[14,12],[28,24]],"k":["\"KẾT LƯỢT\": Một đơn vị DAEHAN trong tay \"HẤP THỤ\" 1 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\"","\"KẾT LƯỢT\": Một đơn vị DAEHAN trong tay \"HẤP THỤ\" 2 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\"","\"KẾT LƯỢT\": Một đơn vị DAEHAN trong tay \"HẤP THỤ\" 3 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\""],"id":148,"tags":["HAPTHU","SHOPBUFF"],"kw":[],"fx":[[],[],[]]},{"n":"YEONGDEUNG HALMANG","t":"DAEHAN","c":4,"sum":false,"s":[[8,3],[16,6],[32,9]],"k":["Sau khi ngươi \"ĐỔI LẠI\" 3 lần, nhận 1 đơn vị ngẫu nhiên từ \"THÁNH ĐỀN\" (3 lần mỗi lượt)","Sau khi ngươi \"ĐỔI LẠI\" 3 lần, nhận 1 đơn vị ngẫu nhiên từ \"THÁNH ĐỀN\" (6 lần mỗi lượt)","Sau khi ngươi \"ĐỔI LẠI\" 3 lần, nhận 1 đơn vị ngẫu nhiên từ \"THÁNH ĐỀN\" (9 lần mỗi lượt)"],"id":149,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"JOWANGSIN","t":"DAEHAN","c":4,"sum":false,"s":[[6,4],[12,8],[24,16]],"k":["Bất cứ khi nào ngươi triển khai một đơn vị CẤP chắn, cho tất cả đơn vị trong \"THÁNH ĐỀN\" +2 \"SÁT THƯƠNG\" cho đến lượt sau. Nếu nó là CẤP lẻ cho +2 \"MÁU\" cho đến lượt sau.","Bất cứ khi nào ngươi triển khai một đơn vị CẤP chắn, cho tất cả đơn vị trong \"THÁNH ĐỀN\" +4 \"SÁT THƯƠNG\" cho đến lượt sau. Nếu nó là CẤP lẻ cho +4 \"MÁU\" cho đến lượt sau.","Bất cứ khi nào ngươi triển khai một đơn vị CẤP chắn, cho tất cả đơn vị trong \"THÁNH ĐỀN\" +8 \"SÁT THƯƠNG\" cho đến lượt sau. Nếu nó là CẤP lẻ cho +8 \"MÁU\" cho đến lượt sau."],"id":150,"tags":["TRIENKHAI","SHOPBUFF"],"kw":[],"fx":[[],[],[]]},{"n":"SANSIN","t":"DAEHAN","c":4,"sum":false,"s":[[5,5],[10,10],[20,20]],"k":["Khi \"SANSIN\" ở trong tay, bất cứ khi nào một thẻ bài (đơn vị, phép, tiên đan) được thêm vào tay, nhận +3/+3","Khi \"SANSIN\" ở trong tay, bất cứ khi nào một thẻ bài (đơn vị, phép, tiên đan) được thêm vào tay, nhận +6/+6","Khi \"SANSIN\" ở trong tay, bất cứ khi nào một thẻ bài (đơn vị, phép, tiên đan) được thêm vào tay, nhận +12/+12"],"id":151,"tags":["HANDGROW"],"kw":[],"fx":[[{"tr":"OTHER","a":3,"h":3,"lim":0,"tg":"self"}],[{"tr":"OTHER","a":6,"h":6,"lim":0,"tg":"self"}],[{"tr":"OTHER","a":12,"h":12,"lim":0,"tg":"self"}]]},{"n":"ĐẠO SĨ","t":"DAEHAN","c":3,"sum":false,"s":[[5,5],[10,10],[20,20]],"k":["\"TẦM XA\"-\"KẾT LIỄU(1)\": Cho các đơn vị trong \"THÁNH ĐỀN\" +1 \"SÁT THƯƠNG\" trong trận này","\"TẦM XA\"-\"KẾT LIỄU(1)\": Cho các đơn vị trong \"THÁNH ĐỀN\" +2 \"SÁT THƯƠNG\" trong trận này","\"TẦM XA\"-\"KẾT LIỄU(1)\": Cho các đơn vị trong \"THÁNH ĐỀN\" +4 \"SÁT THƯƠNG\" trong trận này"],"id":152,"tags":["KETLIEU","SHOPBUFF"],"kw":["TẦM XA"],"fx":[[],[],[]]},{"n":"BULGASARI","t":"DAEHAN","c":3,"sum":false,"s":[[1,1],[2,2],[4,4]],"k":["\"KẾT LƯỢT\": \"HẤP THỤ\" 1 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\" hiện tại","\"KẾT LƯỢT\": \"HẤP THỤ\" 2 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\" hiện tại","\"KẾT LƯỢT\": \"HẤP THỤ\" 3 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\" hiện tại"],"id":153,"tags":["HAPTHU","SHOPBUFF"],"kw":[],"fx":[[],[],[]]},{"n":"DOKKAEBI","t":"DAEHAN","c":3,"sum":false,"s":[[4,4],[8,8],[16,16]],"k":["Khi ngươi bán \"DOKKAEBI\" này, nhận 1 đơn vị ngẫu nhiên từ CẤP 3 hoặc thấp hơn từ \"THÁNH ĐỀN\" hiện tại","Khi ngươi bán \"DOKKAEBI\" này, nhận 2 đơn vị ngẫu nhiên từ CẤP 3 hoặc thấp hơn từ \"THÁNH ĐỀN\" hiện tại","Khi ngươi bán \"DOKKAEBI\" này, nhận 3 đơn vị ngẫu nhiên từ CẤP 3 hoặc thấp hơn từ \"THÁNH ĐỀN\" hiện tại"],"id":154,"tags":["MUABAN"],"kw":[],"fx":[[],[],[]]},{"n":"INMYEONJO","t":"DAEHAN","c":3,"sum":false,"s":[[5,2],[10,4],[20,8]],"k":["\"KẾT LƯỢT\": Cho một đơn vị ngẫu nhiên trong tay +5/+5","\"KẾT LƯỢT\": Cho một đơn vị ngẫu nhiên trong tay +10/+10","\"KẾT LƯỢT\": Cho một đơn vị ngẫu nhiên trong tay +15/+15"],"id":155,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"MUNSIN","t":"DAEHAN","c":3,"sum":false,"s":[[5,1],[10,2],[20,4]],"k":["\"TỬ VONG\": Triệu hồi 1 đơn vị có chỉ số cao nhất từ tay","\"TỬ VONG\": Triệu hồi 2 đơn vị có chỉ số cao nhất từ tay","\"TỬ VONG\": Triệu hồi 3 đơn vị có chỉ số cao nhất từ tay"],"id":156,"tags":["TRIEUHOI"],"kw":[],"fx":[[],[],[]]},{"n":"NHÂN SÂM TRẺ","t":"DAEHAN","c":2,"sum":false,"s":[[1,1],[2,2],[4,4]],"k":["Khi bán \"NHÂN SÂM TRẺ\", nhận một \"NHÂN SÂM GIÀ\" lv1","Khi bán \"NHÂN SÂM TRẺ\", nhận một \"NHÂN SÂM GIÀ\" lv2","Khi bán \"NHÂN SÂM TRẺ\", nhận một \"NHÂN SÂM GIÀ\" lv3"],"id":157,"tags":["MUABAN"],"kw":[],"fx":[[],[],[]]},{"n":"GUMIHO","t":"DAEHAN","c":2,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["\"TRIỂN KHAI\": Chọn 1 đơn vị DAEHAN, đơn vị đó \"HẤP THỤ\" 1 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\"","\"TRIỂN KHAI\": Chọn 1 đơn vị DAEHAN, đơn vị đó \"HẤP THỤ\" 2 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\"","\"TRIỂN KHAI\": Chọn 1 đơn vị DAEHAN, đơn vị đó \"HẤP THỤ\" 3 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\""],"id":158,"tags":["HAPTHU","SHOPBUFF"],"kw":[],"fx":[[],[],[]]},{"n":"HORANGI","t":"DAEHAN","c":2,"sum":false,"s":[[4,3],[8,6],[16,12]],"k":["\"TRIỂN KHAI\": Cho đơn vị trong \"THÁNH ĐỀN\" +1/+1 trong trận này","\"TRIỂN KHAI\": Cho đơn vị trong \"THÁNH ĐỀN\" +2/+2 trong trận này","\"TRIỂN KHAI\": Cho đơn vị trong \"THÁNH ĐỀN\" +4/+4 trong trận này"],"id":159,"tags":["SHOPBUFF"],"kw":[],"fx":[[],[],[]]},{"n":"SAMJOKO","t":"DAEHAN","c":2,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["Bất cứ khi nào một đồng minh DAEHAN được triệu hồi trong chiến đấu, cho một đơn vị ngẫu nhiên trong tay +1/+1","Bất cứ khi nào một đồng minh DAEHAN được triệu hồi trong chiến đấu, cho một đơn vị ngẫu nhiên trong tay +2/+2","Bất cứ khi nào một đồng minh DAEHAN được triệu hồi trong chiến đấu, cho một đơn vị ngẫu nhiên trong tay +4/+4"],"id":160,"tags":["TRIEUHOI"],"kw":[],"fx":[[{"tr":"SUMM","a":1,"h":1,"lim":0,"tg":"ally"}],[{"tr":"SUMM","a":2,"h":2,"lim":0,"tg":"ally"}],[{"tr":"SUMM","a":4,"h":4,"lim":0,"tg":"ally"}]]},{"n":"BULGAE","t":"DAEHAN","c":1,"sum":false,"s":[[4,3],[8,6],[16,12]],"k":["\"TRIỂN KHAI\": \"HẤP THỤ\" 1 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\"","\"TRIỂN KHAI\": \"HẤP THỤ\" 2 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\"","\"TRIỂN KHAI\": \"HẤP THỤ\" 3 đơn vị ngẫu nhiên trong \"THÁNH ĐỀN\""],"id":161,"tags":["HAPTHU","SHOPBUFF"],"kw":[],"fx":[[],[],[]]},{"n":"CHOLLIMA","t":"DAEHAN","c":1,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["Khi có chỗ trống trên sân và \"CHOLLIMA\" ở trong tay, triệu hồi \"CHOLLIMA\"","Khi có chỗ trống trên sân và \"CHOLLIMA\" ở trong tay, triệu hồi \"CHOLLIMA\" và x2 \"SÁT THƯƠNG\"","Khi có chỗ trống trên sân và \"CHOLLIMA\" ở trong tay, triệu hồi \"CHOLLIMA\" và x2 chỉ số"],"id":162,"tags":["TRIEUHOI","HANDSUMM"],"kw":[],"fx":[[],[],[]]},{"n":"VONG HỒN","t":"DAEHAN","c":0,"sum":true,"s":[[1,1],[2,2],[4,4]],"k":["Không có","Không có","Không có"],"id":163,"tags":[],"kw":[],"fx":[[],[],[]]},{"n":"NHÂN SÂM GIÀ","t":"DAEHAN","c":0,"sum":true,"s":[[1,1],[2,2],[4,4]],"k":["\"TRIỂN KHAI\": Cho các đơn vị trong \"THÁNH ĐỀN\" trận này chỉ số bằng với số vòng mà \"NHÂN SÂM TRẺ\" đã ở trên sân","\"TRIỂN KHAI\": Cho các đơn vị trong \"THÁNH ĐỀN\" trận này chỉ số gấp đôi số vòng mà \"NHÂN SÂM TRẺ\" đã ở trên sân","\"TRIỂN KHAI\": Cho các đơn vị trong \"THÁNH ĐỀN\" trận này chỉ số gấp ba số vòng mà \"NHÂN SÂM TRẺ\" đã ở trên sân"],"id":164,"tags":["SHOPBUFF"],"kw":[],"fx":[[],[],[]]},{"n":"HARMONIA","t":"NEUTRAL","c":6,"sum":false,"s":[[5,7],[10,14],[20,28]],"k":["\"KẾT LƯỢT\": Cho mọi đồng minh +2/+2, lặp lại cho mỗi TỘC khác nhau trên sân","\"KẾT LƯỢT\": Cho mọi đồng minh +4/+4, lặp lại cho mỗi TỘC khác nhau trên sân","\"KẾT LƯỢT\": Cho mọi đồng minh +8/+8, lặp lại cho mỗi TỘC khác nhau trên sân"],"id":165,"tags":[],"kw":[],"fx":[[{"tr":"SHOP","a":2,"h":2,"lim":0,"tg":"ally"}],[{"tr":"SHOP","a":4,"h":4,"lim":0,"tg":"ally"}],[{"tr":"SHOP","a":8,"h":8,"lim":0,"tg":"ally"}]]},{"n":"AGONISTA","t":"NEUTRAL","c":5,"sum":false,"s":[[6,6],[12,12],[24,24]],"k":["\"HÀO QUANG\": Hiệu ứng \"TRIỂN KHAI\" của đồng minh kích hoạt 2 lần","\"HÀO QUANG\": Hiệu ứng \"TRIỂN KHAI\" của đồng minh kích hoạt 3 lần","\"HÀO QUANG\": Hiệu ứng \"TRIỂN KHAI\" của đồng minh kích hoạt 4 lần"],"id":166,"tags":[],"kw":["HÀO QUANG"],"fx":[[],[],[]]},{"n":"MORTISSA","t":"NEUTRAL","c":5,"sum":false,"s":[[6,2],[12,4],[24,8]],"k":["\"HÀO QUANG\": Hiệu ứng \"TỬ VONG\" của đồng minh kích hoạt thêm 1 lần","\"HÀO QUANG\": Hiệu ứng \"TỬ VONG\" của đồng minh kích hoạt thêm 2 lần","\"HÀO QUANG\": Hiệu ứng \"TỬ VONG\" của đồng minh kích hoạt thêm 3 lần"],"id":167,"tags":[],"kw":["HÀO QUANG"],"fx":[[],[],[]]},{"n":"QUETZ","t":"NEUTRAL","c":5,"sum":false,"s":[[6,2],[12,4],[24,8]],"k":["\"TRIỂN KHAI\": \"TRIỆU TẬP\" một \"PHÉP THÁNH ĐỀN\"","\"TRIỂN KHAI\": \"TRIỆU TẬP\" một \"PHÉP THÁNH ĐỀN\", 2 lần","\"TRIỂN KHAI\": \"TRIỆU TẬP\" một \"PHÉP THÁNH ĐỀN\", 3 lần"],"id":168,"tags":["PHEP"],"kw":[],"fx":[[],[],[]]},{"n":"AVIDARA","t":"NEUTRAL","c":5,"sum":false,"s":[[1,5],[2,10],[4,20]],"k":["\"HÀO QUANG\": Hiệu ứng \"KẾT LƯỢT\" của đồng minh kích hoạt 2 lần","\"HÀO QUANG\": Hiệu ứng \"KẾT LƯỢT\" của đồng minh kích hoạt 3 lần","\"HÀO QUANG\": Hiệu ứng \"KẾT LƯỢT\" của đồng minh kích hoạt 4 lần"],"id":169,"tags":[],"kw":["HÀO QUANG"],"fx":[[],[],[]]},{"n":"INFESTA","t":"NEUTRAL","c":5,"sum":false,"s":[[1,5],[2,10],[4,20]],"k":["\"TỬ VONG\": Hủy diệt kẻ địch kết liễu \"INFESTA\"","\"TỬ VONG\": Hủy diệt kẻ địch kết liễu \"INFESTA\" và gây 20 sát thương lên 1 kẻ địch ngẫu nhiên","\"TỬ VONG\": Hủy diệt kẻ địch kết liễu \"INFESTA\" và gây 20 sát thương lên 2 kẻ địch ngẫu nhiên"],"id":170,"tags":["KETLIEU"],"kw":[],"fx":[[],[],[]]},{"n":"CHALCHIU","t":"NEUTRAL","c":5,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["\"KẾT LƯỢT\": Cho một đồng minh từ mỗi TỘC +3/+3","\"KẾT LƯỢT\": Cho một đồng minh từ mỗi TỘC +6/+6","\"KẾT LƯỢT\": Cho một đồng minh từ mỗi TỘC +12/+12"],"id":171,"tags":[],"kw":[],"fx":[[{"tr":"SHOP","a":3,"h":3,"lim":0,"tg":"ally"}],[{"tr":"SHOP","a":6,"h":6,"lim":0,"tg":"ally"}],[{"tr":"SHOP","a":12,"h":12,"lim":0,"tg":"ally"}]]},{"n":"THỔ DÂN MAN RỢ","t":"NEUTRAL","c":5,"sum":false,"s":[[7,9],[14,18],[28,36]],"k":["\"LIÊN KÍCH\"-\"TẤN CÔNG\": Loại bỏ \"KHIÊU KHÍCH\", \"TÁI SINH\" và \"HIỂM ĐỘC\" ra khỏi mục tiêu","\"LIÊN KÍCH\"-\"TẤN CÔNG\": Loại bỏ \"KHIÊU KHÍCH\", \"TÁI SINH\", \"HIỂM ĐỘC\" và \"LÁ CHẮN\" ra khỏi mục tiêu","\"LIÊN KÍCH\"-\"TẤN CÔNG\": Loại bỏ \"KHIÊU KHÍCH\", \"TÁI SINH\", \"HIỂM ĐỘC\", \"LÁ CHẮN\", \"TRẢM KÍCH\", \"XUYÊN KÍCH\" ra khỏi mục tiêu"],"id":172,"tags":["TAISINH","LACHAN"],"kw":["KHIÊU KHÍCH","HIỂM ĐỘC","XUYÊN KÍCH","TRẢM KÍCH","LIÊN KÍCH","LÁ CHẮN"],"fx":[[],[],[]]},{"n":"AZALEA","t":"NEUTRAL","c":4,"sum":false,"s":[[3,1],[6,2],[12,4]],"k":["\"TRIỂN KHAI\": Cho mọi đồng minh trên sân +2/+2","\"TRIỂN KHAI\": Cho mọi đồng minh trên sân +4/+4","\"TRIỂN KHAI\": Cho mọi đồng minh trên sân +8/+8"],"id":173,"tags":[],"kw":[],"fx":[[{"tr":"SHOP","a":2,"h":2,"lim":0,"tg":"ally"}],[{"tr":"SHOP","a":4,"h":4,"lim":0,"tg":"ally"}],[{"tr":"SHOP","a":8,"h":8,"lim":0,"tg":"ally"}]]},{"n":"SALAMVAFER","t":"NEUTRAL","c":4,"sum":false,"s":[[4,5],[8,10],[16,20]],"k":["\"KẾT LƯỢT\": Cho mọi đồng minh +2 \"MÁU\" (Đổi lại \"SÁT THƯƠNG\"/\"MÁU\" mỗi lượt)","\"KẾT LƯỢT\": Cho mọi đồng minh +3 \"MÁU\" (Đổi lại \"SÁT THƯƠNG\"/\"MÁU\" mỗi lượt)","\"KẾT LƯỢT\": Cho mọi đồng minh +6 \"MÁU\" (Đổi lại \"SÁT THƯƠNG\"/\"MÁU\" mỗi lượt)"],"id":174,"tags":[],"kw":[],"fx":[[{"tr":"SHOP","a":0,"h":2,"lim":0,"tg":"ally"}],[{"tr":"SHOP","a":0,"h":3,"lim":0,"tg":"ally"}],[{"tr":"SHOP","a":0,"h":6,"lim":0,"tg":"ally"}]]},{"n":"SPORA","t":"NEUTRAL","c":4,"sum":false,"s":[[4,2],[8,4],[16,8]],"k":["\"TỬ VONG\": Cho mọi đồng minh +2 \"MÁU\" và \"LÁ CHẮN\"","\"TỬ VONG\": Cho mọi đồng minh +4 \"MÁU\" và \"LÁ CHẮN\"","\"TỬ VONG\": Cho mọi đồng minh +8 \"MÁU\" và \"LÁ CHẮN\""],"id":175,"tags":["LACHAN"],"kw":["LÁ CHẮN"],"fx":[[{"tr":"DIE","a":0,"h":2,"lim":0,"tg":"ally"}],[{"tr":"DIE","a":0,"h":4,"lim":0,"tg":"ally"}],[{"tr":"DIE","a":0,"h":8,"lim":0,"tg":"ally"}]]},{"n":"SORELL","t":"NEUTRAL","c":3,"sum":false,"s":[[3,3],[6,6],[12,12]],"k":["\"TRIỂN KHAI\": Nhận một \"PHÉP THÁNH ĐỀN\" CẤP 2","\"TRIỂN KHAI\": Nhận một \"PHÉP THÁNH ĐỀN\" CẤP 3","\"TRIỂN KHAI\": Nhận một \"PHÉP THÁNH ĐỀN\" CẤP 6"],"id":176,"tags":["PHEP"],"kw":[],"fx":[[],[],[]]},{"n":"HỘ VỆ THỔ DÂN","t":"NEUTRAL","c":3,"sum":false,"s":[[1,6],[2,12],[4,24]],"k":["\"KHIÊU KHÍCH\": Bất cứ khi nào \"HỘ VỆ THỔ DÂN\" bị tấn công, cho một đơn vị từ mỗi TỘC +1/+1 \"VĨNH VIỄN\"","\"KHIÊU KHÍCH\": Bất cứ khi nào \"HỘ VỆ THỔ DÂN\" bị tấn công, cho một đơn vị từ mỗi TỘC +2/+2 \"VĨNH VIỄN\"","\"KHIÊU KHÍCH\": Bất cứ khi nào \"HỘ VỆ THỔ DÂN\" bị tấn công, cho một đơn vị từ mỗi TỘC +4/+4 \"VĨNH VIỄN\""],"id":177,"tags":[],"kw":["KHIÊU KHÍCH"],"fx":[[{"tr":"ATK","a":1,"h":1,"lim":0,"tg":"ally"}],[{"tr":"ATK","a":2,"h":2,"lim":0,"tg":"ally"}],[{"tr":"ATK","a":4,"h":4,"lim":0,"tg":"ally"}]]},{"n":"THỢ SĂN HUNG TÀN","t":"NEUTRAL","c":3,"sum":false,"s":[[3,1],[6,2],[12,4]],"k":["\"KẾT LIỄU(1)\": Nhận 1 Vàng vào lượt sau","\"KẾT LIỄU(1)\": Nhận 2 Vàng vào lượt sau","\"KẾT LIỄU(1)\": Nhận 4 Vàng vào lượt sau"],"id":178,"tags":["KETLIEU","KINHTE"],"kw":[],"fx":[[],[],[]]},{"n":"TRINH SÁT THỔ DÂN","t":"NEUTRAL","c":2,"sum":false,"s":[[1,1],[2,2],[4,4]],"k":["Khi ngươi bán \"TRINH SÁT THỔ DÂN\" \"TRIỆU TẬP\" 1 đơn vị CẤP 1 (CẤP của đơn vị được \"TRIỆU TẬP\" tăng thêm 1 sau mỗi vòng \"TRINH SÁT THỔ DÂN\" ở trên sân)","Khi ngươi bán \"TRINH SÁT THỔ DÂN\" \"TRIỆU TẬP\" 1 đơn vị CẤP 3 (CẤP của đơn vị được \"TRIỆU TẬP\" tăng thêm 1 sau mỗi vòng \"TRINH SÁT THỔ DÂN\" ở trên sân)","Khi ngươi bán \"TRINH SÁT THỔ DÂN\" \"TRIỆU TẬP\" 1 đơn vị CẤP 6"],"id":179,"tags":["MUABAN"],"kw":[],"fx":[[],[],[]]},{"n":"ROSETTE","t":"NEUTRAL","c":2,"sum":false,"s":[[2,2],[4,4],[8,8]],"k":["\"TRIỂN KHAI\": Cho 2 đồng minh +2 \"MÁU\" và \"KHIÊU KHÍCH\"","\"TRIỂN KHAI\": Cho 2 đồng minh +4 \"MÁU\" và \"KHIÊU KHÍCH\"","\"TRIỂN KHAI\": Cho 2 đồng minh +8 \"MÁU\" và \"KHIÊU KHÍCH\""],"id":180,"tags":[],"kw":["KHIÊU KHÍCH"],"fx":[[{"tr":"SHOP","a":0,"h":2,"lim":0,"tg":"ally"}],[{"tr":"SHOP","a":0,"h":4,"lim":0,"tg":"ally"}],[{"tr":"SHOP","a":0,"h":8,"lim":0,"tg":"ally"}]]},{"n":"EITRI","t":"NEUTRAL","c":2,"sum":false,"s":[[1,5],[2,10],[4,20]],"k":["\"KẾT LƯỢT\": Nhận 1 \"KIẾM ĐÃ MÀI\" hoặc 1 \"GIÁP ĐÃ ĐỘN\"","\"KẾT LƯỢT\": Nhận 1 \"BINH KHÍ HOÀNG GIA\"","\"KẾT LƯỢT\": Nhận 1 \"LƯƠNG NGÂN BINH KHÍ\""],"id":181,"tags":[],"kw":[],"fx":[[],[],[]]}];
const SPELLS = [{"n":"TRIỆU TẬP CHUẨN XÁC","c":6,"p":0,"d":"Chọn một đơn vị, \"TRIỆU TẬP\" một đơn vị cũng CẤP","id":0,"eff":{"type":"discover"}},{"n":"PHẤT CỜ HIỆU TRIỆU","c":6,"p":0,"d":"Cho tất cả đồng minh +6/+6","id":1,"eff":{"type":"buff","a":6,"h":6,"tg":"all","temp":false}},{"n":"DÂNG HỒN","c":6,"p":0,"d":"Chọn 1 đơn vị. \"ĐỔI LẠI\" toàn bộ \"THÁNH ĐỀN\" bằng những đơn vị cùng TỘC với đơn vị đã chọn","id":2,"eff":{"type":"manual"}},{"n":"ĐỀN PHÉP","c":6,"p":0,"d":"\"ĐỔI LẠI\" toàn bộ \"THÁNH ĐỀN\" thành \"PHÉP THÁNH ĐỀN\"","id":3,"eff":{"type":"manual"}},{"n":"KHAI SÁNG","c":6,"p":0,"d":"Biến chỉ số của 1 đơn vị thành 20/20","id":4,"eff":{"type":"manual"}},{"n":"THÁNH KIẾM CỦA KẺ ĐƯỢC CHỌN","c":6,"p":0,"d":"Thăng cấp một đơn vị lv1 từ CẤP 4 trở xuống","id":5,"eff":{"type":"manual"}},{"n":"VIỆN TRỢ VÔ DANH","c":5,"p":0,"d":"Nếu ngươi thua lượt trước, nhận 4 Vàng","id":6,"eff":{"type":"manual"}},{"n":"LƯƠNG NGÂN BINH KHÍ","c":5,"p":0,"d":"Cho 1 đơn vị +8/+8 nhân với lv của nó","id":7,"eff":{"type":"buff","a":8,"h":8,"tg":"one","temp":false}},{"n":"HỘI HỌP QUÂN ĐOÀN","c":5,"p":0,"d":"Chọn một: Nhận 2 đơn vị ngẫu nhiên CẤP 3, CẤP 4 hoặc CẤP 5","id":8,"eff":{"type":"manual"}},{"n":"LỜI NGUYỀN CHIẾN TRẬN","c":5,"p":0,"d":"\"KHAI TRẬN\" Biến \"MÁU\" của một kẻ địch ngẫu nhiên thành 1","id":9,"eff":{"type":"manual"}},{"n":"TRIỆU TẬP TỐI CAO","c":5,"p":0,"d":"\"TRIỆU TẬP\" một đơn vị từ CẤP 6","id":10,"eff":{"type":"discover"}},{"n":"ƯỚP XÁC","c":5,"p":0,"d":"Hủy diệt một đồng minh NILES. Khi có khoảng trống trong chiến đấu. Triệu hồi đơn vị đó và biến \"MÁU\" thành 1 (Phép này không thể cộng dồn)","id":11,"eff":{"type":"manual"}},{"n":"TRINH SÁT TÍ HON","c":4,"p":0,"d":"Chọn 1 khoảng trống trên sân kẻ địch kế tiếp để \"DO THÁM\"","id":12,"eff":{"type":"manual"}},{"n":"GỌI ĐÒ","c":4,"p":0,"d":"Nhận 1 \"CHARON\" vào lượt sau","id":13,"eff":{"type":"manual"}},{"n":"JORMUNGANDR NUỐT CHỬNG","c":4,"p":0,"d":"\"LOẠI BỎ\" một đơn vị. Đưa chỉ số của nó cho một đồng minh ngẫu nhiên","id":14,"eff":{"type":"manual"}},{"n":"TÚI THẦN","c":4,"p":0,"d":"Nhận 3 \"TIÊN ĐAN\" ngẫu nhiên","id":15,"eff":{"type":"manual"}},{"n":"LỬA HY LẠP","c":4,"p":0,"d":"\"KHAI TRẬN\" \"ĐỐT(4)\" một kẻ địch ngẫu nhiên trên hàng trước","id":16,"eff":{"type":"manual"}},{"n":"MƯA TÊN","c":4,"p":0,"d":"Chọn một đồng minh. \"KHAI TRẬN\" cho nó \"TỬ VONG\": Gây 2 sát thương lên toàn bộ đơn vị (cả 2 bên)","id":17,"eff":{"type":"manual"}},{"n":"BINH KHÍ HOÀNG GIA","c":4,"p":0,"d":"Cho một đồng minh +4/+8 và \"KHIÊU KHÍCH\"","id":18,"eff":{"type":"buff","a":4,"h":8,"tg":"one","temp":false,"kw":["KHIÊU KHÍCH"]}},{"n":"ĐỘC NHẤT SA MẠC","c":4,"p":0,"d":"Khi sân trống, \"TRIỆU HỒI\" 1 \"BỌ CẠP\" 1/1 với \"HIỂM ĐỘC\" (Không cộng dồn)","id":19,"eff":{"type":"manual"}},{"n":"LIÊN THỦ LIÊN GIỚI","c":4,"p":0,"d":"Cho một đồng minh từ mỗi TỘC +4/+4","id":20,"eff":{"type":"buff","a":4,"h":4,"tg":"one","temp":false}},{"n":"THỨC THĂNG HOA","c":4,"p":0,"d":"Thay thế tất cả thẻ trong \"THÁNH ĐỀN\" bằng thẻ cao hơn 1 CẤP","id":21,"eff":{"type":"manual"}},{"n":"GỌI NHẬP NGŨ","c":4,"p":0,"d":"\"TRIỆU TẬP\" một đơn vị có \"TRIỂN KHAI\"","id":22,"eff":{"type":"discover"}},{"n":"PHÉP CHIÊU HỒN","c":4,"p":0,"d":"\"TRIỆU TẬP\" một đơn vị có \"TỬ VONG\"","id":23,"eff":{"type":"discover"}},{"n":"LÍNH ĐÁNH THUÊ","c":4,"p":0,"d":"Khi có khoảng trống trên sân triệu hồi \"LÍNH ĐÁNH THUÊ\"","id":24,"eff":{"type":"manual"}},{"n":"GIAO KÈO CỦA QUỶ","c":4,"p":0,"d":"Mất 1 mạng - Nhận 6 vàng","id":25,"eff":{"type":"manual"}},{"n":"KHIÊN MƯỢN","c":3,"p":0,"d":"Cho một đồng minh OLYMPUS \"LÁ CHẮN\" cho đến lượt sau","id":26,"eff":{"type":"buff","a":0,"h":0,"tg":"one","temp":true,"kw":["LÁ CHẮN"]}},{"n":"PHIẾN ĐÁ SỐ PHẬN","c":3,"p":1,"d":"Chọn 1 đơn vị, sau đó chọn 1 đơn vị BABYLON để biến nó thành đơn vị BABYLON đó","id":27,"eff":{"type":"manual"}},{"n":"TẬN DỤNG","c":3,"p":1,"d":"Chọn một đơn vị \"LOẠI BỎ\" nó và đưa \"SÁT THƯƠNG\" hoặc \"MÁU\" cho 1 đồng minh Khác","id":28,"eff":{"type":"manual"}},{"n":"HÌNH NHÂN LUYỆN TẬP","c":3,"p":2,"d":"Khi có khoảng trống trên sân kẻ địch, triệu hồi một \"HÌNH NHÂN\" có 0/1 (Không cộng dồn)","id":29,"eff":{"type":"manual"}},{"n":"THAY TÂM ĐỔI TÍNH","c":3,"p":3,"d":"Cho một đơn vị \"KHIÊU KHÍCH\", nếu đã có \"KHIÊU KHÍCH\" thì xóa nó và cho +3 \"SÁT THƯƠNG\"","id":30,"eff":{"type":"buff","a":3,"h":0,"tg":"one","temp":false,"kw":["KHIÊU KHÍCH"]}},{"n":"THẮP LỬA THÁNH ĐỀN","c":3,"p":2,"d":"Các đơn vị trong \"THÁNH ĐỀN\" có +1/+2 trong game này","id":31,"eff":{"type":"buff","a":1,"h":2,"tg":"shop","temp":false}},{"n":"NGHI LỄ TRIỆU TẬP","c":3,"p":4,"d":"Chọn 1 đơn vị, \"TRIỆU TẬP\" một đơn vị khác cùng TỘC","id":32,"eff":{"type":"discover"}},{"n":"ĐẶT CƯỢC","c":3,"p":1,"d":"Nếu bạn thắng lượt tiếp theo. Nhận 3 Vàng","id":33,"eff":{"type":"gold","n":3}},{"n":"PHƯỚC LÀNH ĐẤT MẸ","c":3,"p":3,"d":"Chọn 1 đơn vị, cho tất cả đơn vị cùng TỘC +2/+2","id":34,"eff":{"type":"buff","a":2,"h":2,"tg":"one","temp":false}},{"n":"TIẾNG HÉT XUNG TRẬN","c":3,"p":2,"d":"\"KHAI TRẬN\" Cho tất cả đồng minh +2/+1","id":35,"eff":{"type":"buff","a":2,"h":1,"tg":"all","temp":false}},{"n":"HÀO KHÍ DÂNG TRÀO","c":3,"p":3,"d":"Cho 1 đơn vị mỗi khi \"KẾT LƯỢT\" nhận +2/+1 \"VĨNH VIỄN\"","id":36,"eff":{"type":"buff","a":2,"h":1,"tg":"one","temp":false}},{"n":"ĐỒNG DẠ ĐỒNG LÒNG","c":2,"p":1,"d":"Cho 3 đồng minh +1/+1","id":37,"eff":{"type":"buff","a":1,"h":1,"tg":"one","temp":false}},{"n":"THẦN TÀI GÕ CỬA","c":2,"p":2,"d":"Tăng vĩnh viễn \"THU NHẬP\" thêm 1","id":38,"eff":{"type":"manual"}},{"n":"Ý CHỈ THẦN THÁNH","c":2,"p":1,"d":"Cho một đơn vị chỉ số bằng CẤP của \"THÁNH ĐỀN\"","id":39,"eff":{"type":"manual"}},{"n":"TUYỂN CHỌN KỸ CÀNG","c":2,"p":2,"d":"Chọn 1 đơn vị, Nhận một đơn vị khác cùng TỘC","id":40,"eff":{"type":"manual"}},{"n":"ĐẦU TƯ KHÔN NGOAN","c":2,"p":1,"d":"Tăng \"THU NHẬP\" thêm 2 cho đến lượt sau","id":41,"eff":{"type":"manual"}},{"n":"THÁI CỰC TẤN","c":1,"p":1,"d":"Cho một đơn vị +2/+2","id":42,"eff":{"type":"buff","a":2,"h":2,"tg":"one","temp":false}},{"n":"NHẬP TIỆC","c":1,"p":1,"d":"Cho mọi đơn vị trong \"THÁNH ĐỀN\" hiện tại +3 \"MÁU\"","id":43,"eff":{"type":"buff","a":0,"h":3,"tg":"shop","temp":false}},{"n":"KẺ TRỘM THÁNH ĐỀN","c":1,"p":2,"d":"Trộm 1 đơn vị ngẫu nhiên từ \"THÁNH ĐỀN\" hiện tại","id":44,"eff":{"type":"manual"}},{"n":"TUYỂN QUÂN NHANH","c":1,"p":2,"d":"Nhận 1 đơn vị CẤP 1 ngẫu nhiên","id":45,"eff":{"type":"manual"}},{"n":"GIÁP ĐÃ ĐỘN","c":1,"p":1,"d":"Cho một đơn vị +3 \"MÁU\" \"VĨNH VIỄN\" và \"KHIÊU KHÍCH\"","id":46,"eff":{"type":"buff","a":0,"h":3,"tg":"one","temp":false,"kw":["KHIÊU KHÍCH"]}},{"n":"KIẾM ĐÃ MÀI","c":1,"p":1,"d":"Cho một đơn vị +3 \"SÁT THƯƠNG\" \"VĨNH VIỄN\"","id":47,"eff":{"type":"buff","a":3,"h":0,"tg":"one","temp":false}},{"n":"ĐỒNG VÀNG CỔ","c":1,"p":1,"d":"Nhận 1 Vàng","id":48,"eff":{"type":"gold","n":1}},{"n":"PHẦN THƯỞNG THĂNG CẤP","c":6,"p":0,"d":"\"TRIỆU TẬP\": Xem 3 đơn vị ngẫu nhiên cao hơn cấp \"THÁNH ĐỀN\" hiện tại 1 bậc, chọn 1 nhận vào tay. (Nhận được khi nâng cấp 1 đơn vị quân — không có giá)","id":49,"eff":{"type":"discover"}}];
const DANS = [{"n":"LÃO TỬ TIÊN ĐAN","c":6,"d":"Cho \"TÔN NGỘ KHÔNG\" +6/+6 \"VĨNH VIỄN\"; hoặc \"LÁ CHẮN\"; hoặc \"XUYÊN KÍCH\"; hoặc \"TRẢM KÍCH\" cho đến lượt sau","id":0,"eff":{"type":"buff","a":6,"h":6,"tg":"one","temp":true,"kw":["XUYÊN KÍCH","TRẢM KÍCH","LÁ CHẮN"]}},{"n":"NGŨ UẨN ĐAN","c":6,"d":"Cho 1 đồng minh +5/+5 \"VĨNH VIỄN\" và cho nó \"LÁ CHẮN\", \"TÁI SINH\", \"TRẢM KÍCH\", \"XUYÊN KÍCH\", \"KHIÊU KHÍCH\" đến lượt sau","id":1,"eff":{"type":"buff","a":5,"h":5,"tg":"one","temp":true,"kw":["KHIÊU KHÍCH","XUYÊN KÍCH","TRẢM KÍCH","LÁ CHẮN"]}},{"n":"THĂNG HOA ĐAN","c":6,"d":"tăng gấp đôi chỉ số của 1 đơn vị cho đến lượt sau","id":2,"eff":{"type":"manual"}},{"n":"BẢO MỆNH ĐAN","c":6,"d":"Cho một đồng minh bỏ qua lần đầu tiên nhận sát thương gây \"TỬ VONG\" cho đến lượt sau","id":3,"eff":{"type":"manual"}},{"n":"LONG LÂN ĐAN","c":5,"d":"Cho một đồng minh +5/+5 \"VĨNH VIỄN\" và \"LÁ CHẮN\" cho đến lượt sau","id":4,"eff":{"type":"buff","a":5,"h":5,"tg":"one","temp":true,"kw":["LÁ CHẮN"]}},{"n":"HOÀN HỒN ĐAN","c":5,"d":"Cho một đồng minh \"TÁI SINH\" với toàn bộ \"SÁT THƯƠNG\" cho đến lượt sau","id":5,"eff":{"type":"manual"}},{"n":"HỔ CUỒNG ĐAN","c":4,"d":"Tăng gấp đôi \"SÁT THƯƠNG\" của một đồng minh cho đến lượt sau","id":6,"eff":{"type":"double","temp":true}},{"n":"KIÊN CỐT ĐAN","c":3,"d":"Cho một đồng minh +3/+3 \"VĨNH VIỄN\" và \"LÁ CHẮN\" cho đến lượt sau","id":7,"eff":{"type":"buff","a":3,"h":3,"tg":"one","temp":true,"kw":["LÁ CHẮN"]}},{"n":"THÁI CỰC ĐAN","c":2,"d":"Cho một đồng minh +1/+1 \"VĨNH VIỄN\"","id":8,"eff":{"type":"buff","a":1,"h":1,"tg":"one","temp":false}},{"n":"DIÊN THỌ ĐAN","c":1,"d":"Cho một đồng minh +1 \"MÁU\" \"VĨNH VIỄN\"","id":9,"eff":{"type":"buff","a":0,"h":1,"tg":"one","temp":false}},{"n":"BỘI LỰC ĐAN","c":1,"d":"Cho một đồng minh +1 \"SÁT THƯƠNG\" \"VĨNH VIỄN\"","id":10,"eff":{"type":"buff","a":1,"h":0,"tg":"one","temp":false}}];
const GUARDIANS = [{"n":"HORUS","unlock":0,"skill":"Mắt thần Horus","cost":"4 vàng | CD: 1 vòng","desc":"Triệu tập 1 đơn vị cao hơn 1 CẤP so với cấp THÁNH ĐỀN hiện tại. (Nếu THÁNH ĐỀN đã cấp 6 → triệu tập đơn vị CẤP 6.)"},{"n":"RA","unlock":0,"skill":"Phước lành thái dương","cost":"Nội tại","desc":"Sau khi triệu hồi 1 đơn vị trong chiến đấu → cho nó +1/+1 và KHIÊU KHÍCH."},{"n":"ENLIL","unlock":3,"skill":"Quyền năng tối cao","cost":"1 lần / trận","desc":"Thăng cấp cho 1 đồng minh."},{"n":"ISHTAR","unlock":0,"skill":"Trái tim dũng mãnh","cost":"Nội tại","desc":"Nhận thêm 3 mạng khi vào trận."},{"n":"ZEUS","unlock":3,"skill":"Tia chớp của Zeus","cost":"1 vàng | CD: 1 vòng","desc":"KHAI TRẬN: Gây 3 sát thương lên kẻ địch nhiều máu nhất. +3 sát thương mỗi khi sử dụng Phép thánh đền \"SÁT THƯƠNG\" cộng dồn cả trận đấu."},{"n":"ODIN","unlock":0,"skill":"Vinh quang từ Valhalla","cost":"Nội tại","desc":"Sau khi đồng minh kết liễu 15 kẻ địch HOẶC kích hoạt KẾT LIỄU 9 lần → nhận 1 Phần thưởng Thăng cấp."},{"n":"NHỊ LANG THẦN","unlock":0,"skill":"Hạo thiên Khuyển","cost":"Nội tại","desc":"Sau khi 20 Tiên đan được sử dụng → nhận một Hạo thiên Khuyển."},{"n":"SET","unlock":0,"skill":"Cắt xén","cost":"3 vàng | CD: 1 lượt, giảm 1 vàng mỗi lượt không dùng, min 0","desc":"Phá hủy 1 đồng minh NILES, tất cả đơn vị NILES (hiện có và mua sau) nhận thêm SÁT THƯƠNG bằng CẤP của đơn vị bị phá hủy. Dùng xong giá reset về 3."},{"n":"ANU","unlock":0,"skill":"Thăng hoa","cost":"2 vàng | CD: 1 lượt","desc":"Chọn 1 đơn vị của ngươi, sau đó chọn 1 đơn vị Bậc cao hơn — biến đơn vị bậc thấp thành đơn vị bậc cao vừa chọn (nhận toàn bộ những gì đơn vị mới sở hữu)."},{"n":"NERGAL","unlock":0,"skill":"Xiềng xích địa ngục","cost":"1 vàng | CD: 1 lượt","desc":"Chọn 1 đơn vị trong THÁNH ĐỀN, cho nó +2/+2 và đưa vào tay (không tốn tiền mua) nhưng khóa trong tay 2 lượt (không triển khai / không bán)."}];

/* ============ HẰNG SỐ ============ */
const COL = {
  bg: "#0E1016", panel: "#171A24", panel2: "#1E2230", line: "#2A3042",
  ink: "#E9ECF4", mut: "#8B93A7", gold: "#E4B14E", red: "#E4586B",
  green: "#58C08B", blue: "#6FA8DC", purple: "#B08BD9",
};
const TRIBE_META = {
  NILES: { c: "#D9A441", l: "Niles" }, OLYMPUS: { c: "#7EA6E0", l: "Olympus" },
  YGGDRASIL: { c: "#6FBF8F", l: "Yggdrasil" }, SHENZHOU: { c: "#E06666", l: "Shenzhou" },
  BABYLON: { c: "#B08BD9", l: "Babylon" }, KAMI: { c: "#EE9AAE", l: "Kami" },
  DAEHAN: { c: "#62C9C3", l: "Daehan" }, NEUTRAL: { c: "#9AA3B5", l: "Neutral" },
};
const TAG_LABEL = {
  TAISINH: "Tái Sinh", TRIEUHOI: "Triệu hồi", LACHAN: "Lá Chắn", TIENDAN: "Tiên Đan",
  ANTHAN: "Ẩn Thân", HAPTHU: "Hấp Thụ", KETLIEU: "Kết Liễu", DOT: "Đốt",
  MUABAN: "Kinh tế mua/bán", TRIENKHAI: "Chuỗi triển khai", GAYST: "Chuỗi tấn công Kami",
  NHANST: "Chịu đòn", PHEP: "Phép Thánh Đền", SHOPBUFF: "Buff Thánh Đền", KINHTE: "Kinh tế vàng",
  HANDSUMM: "Tự vào sân từ Túi", ABSORBT: "Hấp Thụ chủ động", HANDGROW: "Lớn lên trong tay",
};
const UP_COST = { 1: 5, 2: 7, 3: 8, 4: 10, 5: 10 };
const SHOP_UNIT_SLOTS = { 1: 3, 2: 4, 3: 4, 4: 5, 5: 5, 6: 6 };
const NUM = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontVariantNumeric: "tabular-nums" };
const DISP = { letterSpacing: "0.12em", textTransform: "uppercase" };

const baseGold = (r) => Math.min(3 + (r - 1), 10);
const upCost = (t, s) => (t >= 6 ? null : Math.max(0, UP_COST[t] - s));

/* ============ LƯU TRỮ (Claude storage → localStorage khi chạy local) ============ */
const hasCloud = typeof window !== "undefined" && !!window.storage;
const mem = {};
async function stGet(key) {
  if (hasCloud) { try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch (e) { return null; } }
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : (mem[key] ?? null); } catch (e) { return mem[key] ?? null; }
}
async function stSet(key, val) {
  const s = JSON.stringify(val);
  if (hasCloud) { try { await window.storage.set(key, s); } catch (e) {} return; }
  try { localStorage.setItem(key, s); } catch (e) { mem[key] = val; }
}

/* ============ TRẠNG THÁI MẶC ĐỊNH ============ */
const DEFAULT_GAME = {
  round: 1, lives: 6, wins: 0, phase: "thuthach", temple: 1, sinceUp: 0, gold: 3,
  tribes: [], guardian: null,
  board: [null, null, null, null, null, null],
  hand: [], // {k:'u',id,lv,dA,dH} | {k:'s',id} | {k:'d',id}
  shop: { units: [], spells: [] }, // units: [{id}|null...], spells: [id|null...]
  danBonus: { a: 0, h: 0 }, // chỉ số cộng thêm Tiên Đan (Hỗn Độn/Thỏ Ngọc/Khổng Minh)
  frozen: false, // Thánh Đền đang đóng băng
  shopBuff: { a: 0, h: 0 }, // chỉ số cộng vào quân trong Thánh Đền (Horagi / Nhập Tiệc...)
  guard: { cd: false, enlil: false, setCost: 3, setUsed: false, dan: 0, spells: 0, nilesBuff: 0 }, // trạng thái Thần Bảo Hộ
  survivalTotal: null, survivalPlayed: 0,
};
const DEFAULT_OVR = { stats: {}, prices: {} };

/* ============ HELPER CHỈ SỐ ============ */
const baseStats = (ovr, uid) => ovr.stats[uid] || UNITS[uid].s;
const effStats = (ovr, cell) => {
  const b = baseStats(ovr, cell.id)[cell.lv];
  return [b[0] + (cell.dA || 0), b[1] + (cell.dH || 0)];
};
const spellPrice = (ovr, sid) => (ovr.prices[sid] !== undefined ? ovr.prices[sid] : SPELLS[sid].p);
const KW_ALL = ["KHIÊU KHÍCH", "TẦM XA", "HIỂM ĐỘC", "XUYÊN KÍCH", "TRẢM KÍCH", "LIÊN KÍCH", "KHÔNG THỂ TẤN CÔNG", "HÀO QUANG", "LÁ CHẮN", "ẨN THÂN", "ĐỐT"];
const effKw = (cell) => {
  const base = UNITS[cell.id].kw;
  return cell.xk && cell.xk.length ? [...base, ...cell.xk.filter((k) => !base.includes(k))] : base;
};

const TIER_BASE = (() => {
  const b = {};
  for (let c = 1; c <= 6; c++) {
    b[c] = [0, 1, 2].map((lv) => {
      const us = UNITS.filter((u) => u.c === c && !u.sum);
      const s = us.reduce((a, u) => a + u.s[lv][0] + u.s[lv][1], 0);
      return us.length ? s / us.length : 1;
    });
  }
  return b;
})();

/* ============ CHẤM ĐIỂM ============ */
function scoreBoard(board, ovr) {
  const bus = board.filter(Boolean).map((x) => ({ u: UNITS[x.id], cell: x }));
  const items = [];
  let total = 0;
  if (!bus.length) return { total: 0, items, count: 0 };
  let statPts = 0;
  bus.forEach(({ u, cell }) => {
    const [a, h] = effStats(ovr, cell);
    if (u.c >= 1) statPts += (10 * (a + h)) / TIER_BASE[u.c][cell.lv];
  });
  statPts = Math.round(statPts);
  items.push({ pts: statPts, label: "Hiệu suất chỉ số so với mặt bằng cấp" });
  total += statPts;
  const tagCount = {};
  bus.forEach(({ u }) => u.tags.forEach((t) => (tagCount[t] = (tagCount[t] || 0) + 1)));
  Object.entries(tagCount).forEach(([t, n]) => {
    if (n >= 2) { const pts = ((n * (n - 1)) / 2) * 4; items.push({ pts, label: `${n} thẻ cùng hệ ${TAG_LABEL[t] || t}` }); total += pts; }
  });
  // Sức mạnh hiệu ứng chiến đấu (từ kỹ năng đã phân tích)
  let fxPts = 0;
  bus.forEach(({ u, cell }) => {
    const fs = (u.fx && u.fx[cell.lv]) || [];
    fs.forEach((f) => {
      const acts = Math.min(f.lim || 3, 3); // ước lượng số lần kích hoạt mỗi trận
      const nTgt = f.tg === "allies" ? Math.max(1, bus.length) : 1;
      const inCombat = f.tr !== "SHOP"; // buff ngoài chiến đấu tính nửa giá
      fxPts += (f.a + f.h) * acts * nTgt * (inCombat ? 1 : 0.5);
    });
  });
  fxPts = Math.round(fxPts * 0.6);
  if (fxPts > 0) { items.push({ pts: fxPts, label: "Sức mạnh hiệu ứng (buff kích hoạt trong trận, ước lượng)" }); total += fxPts; }

  const tribeCount = {};
  bus.forEach(({ u }) => (tribeCount[u.t] = (tribeCount[u.t] || 0) + 1));
  const tribeSyn = {};
  bus.forEach(({ u }) => {
    if (u.k.join(" ").includes(u.t) && tribeCount[u.t] >= 2) tribeSyn[u.t] = (tribeSyn[u.t] || 0) + 3 * (tribeCount[u.t] - 1);
  });
  Object.entries(tribeSyn).forEach(([t, pts]) => { items.push({ pts, label: `Cộng hưởng tộc ${TRIBE_META[t].l} (${tribeCount[t]} quân)` }); total += pts; });
  return { total: Math.round(total), items, count: bus.length };
}

/* điểm "muốn đứng hàng trước" của 1 quân */
function frontScore(ovr, cell) {
  const [a, h] = effStats(ovr, cell);
  const kws = effKw(cell);
  let f = h * 2 - a;
  if (kws.includes("KHIÊU KHÍCH")) f += 100;
  if (kws.includes("TẦM XA") || kws.includes("KHÔNG THỂ TẤN CÔNG") || kws.includes("ẨN THÂN")) f -= 100;
  return f;
}
function autoArrange(board, ovr) {
  const cells = board.filter(Boolean);
  cells.sort((x, y) => frontScore(ovr, y) - frontScore(ovr, x));
  const nb = [null, null, null, null, null, null];
  cells.forEach((c, i) => (nb[i] = c));
  return nb;
}

/* ============ KẾ HOẠCH TỐI ƯU CỤ THỂ ============ */
function buildPlan(g, ovr) {
  const cur = scoreBoard(g.board, ovr);
  const actions = [];
  const notes = [];
  const boardCells = g.board.filter(Boolean);
  const emptyCount = 6 - boardCells.length;
  let goldLeft = g.gold;

  // --- 1. Ghép cặp nâng cấp: đếm bản sao cùng lv trên sân + túi + shop ---
  const copies = {}; // id -> {board:n, hand:n, shop:n} tại lv thấp nhất
  boardCells.forEach((c) => { if (c.lv < 2) { copies[c.id] = copies[c.id] || { b: 0, h: 0, s: 0, lv: c.lv }; copies[c.id].b++; } });
  g.hand.forEach((it) => { if (it.k === "u" && it.lv < 2) { copies[it.id] = copies[it.id] || { b: 0, h: 0, s: 0, lv: it.lv }; copies[it.id].h++; } });
  (g.shop.units || []).forEach((s) => { if (s) { copies[s.id] = copies[s.id] || { b: 0, h: 0, s: 0, lv: 0 }; copies[s.id].s++; } });
  Object.entries(copies).forEach(([id, c]) => {
    const u = UNITS[id];
    const own = c.b + c.h;
    const need = c.lv === 0 ? 3 : 2;
    if (own >= 1 && c.s >= 1 && own + c.s >= need && own < need) {
      const buy = need - own;
      if (goldLeft >= buy * 3) {
        actions.push({ pri: 95, txt: `Mua ${buy} lá "${u.n}" trong Thánh Đền (${buy * 3} vàng) → đủ ${need} lá, ghép lên lv${c.lv + 2}. Nâng cấp còn tặng 1 phép miễn phí.` });
      } else {
        const affordable = Math.floor(goldLeft / 3);
        if (affordable >= 1)
          actions.push({ pri: 88, txt: `Chỉ đủ mua ${affordable}/${buy} lá "${u.n}" — mua ${affordable} lá rồi ❄ ĐÓNG BĂNG Thánh Đền: ${buy - affordable} lá còn lại giữ nguyên sang vòng sau (vòng sau có ${baseGold(g.round + 1)} vàng để mua nốt và ghép lv${c.lv + 2}).` });
        else
          actions.push({ pri: 85, txt: `Không đủ vàng mua "${u.n}" (cần ${buy * 3}) — ❄ ĐÓNG BĂNG Thánh Đền để giữ nguyên sang vòng sau (${baseGold(g.round + 1)} vàng).` });
      }
    }
  });

  // --- 2. Đánh giá từng quân đang bán trong Thánh Đền ---
  const weakest = (() => {
    if (!boardCells.length) return null;
    let w = null, wDelta = Infinity;
    g.board.forEach((c, i) => {
      if (!c) return;
      const b2 = [...g.board]; b2[i] = null;
      const d = cur.total - scoreBoard(b2, ovr).total;
      if (d < wDelta) { wDelta = d; w = { idx: i, cell: c, contrib: d }; }
    });
    return w;
  })();

  (g.shop.units || []).forEach((s) => {
    if (!s) return;
    const u = UNITS[s.id];
    if (goldLeft < 3) return;
    if (emptyCount > 0) {
      const slot = g.board.findIndex((x) => !x);
      const b2 = [...g.board]; b2[slot] = { id: s.id, lv: 0, dA: 0, dH: 0 };
      const d = scoreBoard(b2, ovr).total - cur.total;
      if (u.tags.includes("HANDSUMM")) actions.push({ pri: 62 + d, txt: `Mua "${u.n}" (3 vàng) và GIỮ TRONG TÚI — nó tự TRIỆU HỒI vào sân khi có ô trống trong trận, không tốn ô triển khai.` });
      else if (d > 2) actions.push({ pri: 60 + d, txt: `Mua "${u.n}" (3 vàng) và triển khai vào ô trống → +${d} điểm đội hình.` });
    } else if (weakest) {
      const b2 = [...g.board]; b2[weakest.idx] = { id: s.id, lv: 0, dA: 0, dH: 0 };
      const d = scoreBoard(b2, ovr).total - cur.total;
      if (d > 3) actions.push({ pri: 55 + d, txt: `Bán "${UNITS[weakest.cell.id].n}" (+1 vàng, đóng góp thấp nhất: ${weakest.contrib} điểm) rồi mua "${u.n}" thế chỗ → +${d} điểm ròng.` });
    }
  });

  // --- 3. Triển khai từ túi (miễn phí) ---
  if (emptyCount > 0) {
    g.hand.forEach((it) => {
      if (it.k !== "u") return;
      const slot = g.board.findIndex((x) => !x);
      const b2 = [...g.board]; b2[slot] = { ...it };
      const d = scoreBoard(b2, ovr).total - cur.total;
      actions.push({ pri: 70 + d, txt: `Triển khai "${UNITS[it.id].n}" lv${it.lv + 1} từ Túi (miễn phí) → +${d} điểm.` });
    });
  }

  // --- 4. Phép trong Thánh Đền ---
  const boardTags = new Set();
  boardCells.forEach((c) => UNITS[c.id].tags.forEach((t) => boardTags.add(t)));
  const strongest = boardCells.length
    ? boardCells.reduce((a, b) => (effStats(ovr, a)[0] + effStats(ovr, a)[1] >= effStats(ovr, b)[0] + effStats(ovr, b)[1] ? a : b))
    : null;
  (g.shop.spells || []).forEach((sid) => {
    if (sid === null || sid === undefined) return;
    const sp = SPELLS[sid];
    const price = spellPrice(ovr, sid);
    const eff = sp.eff || { type: "manual" };
    if (goldLeft < price) { notes.push(`Phép "${sp.n}" cần ${price} vàng — đang thiếu ${price - goldLeft}.`); return; }
    // Phép cộng vàng: nếu lời hoặc hòa vốn thì mua-dùng ngay
    if (eff.type === "gold") {
      const net = eff.n - price;
      if (net >= 0) { actions.push({ pri: 92, txt: `Mua rồi dùng ngay phép "${sp.n}" (${price} vàng → nhận ${eff.n} vàng): lời ${net} vàng, không có lý do gì bỏ qua.` }); return; }
    }
    let v = 0; const why = [];
    // Phép buff chỉ số: tính giá trị cụ thể trên mỗi vàng
    if (eff.type === "buff") {
      const nTgt = eff.tg === "all" ? Math.max(1, boardCells.length) : 1;
      const stat = (eff.a + eff.h) * nTgt;
      const perGold = price > 0 ? stat / price : stat;
      v += Math.min(12, Math.round(perGold * 1.5));
      if (eff.tg === "all") why.push(`+${eff.a}/+${eff.h} cho cả ${boardCells.length} quân = ${stat} tổng chỉ số với ${price} vàng`);
      else why.push(`+${eff.a}/+${eff.h}${strongest ? ` — nên dồn vào "${UNITS[strongest.id].n}"` : ""} (${stat} chỉ số / ${price} vàng)`);
    }
    if (eff.type === "double" && strongest) { v += 8; why.push(`gấp đôi ATK — dùng lên "${UNITS[strongest.id].n}" (${effStats(ovr, strongest)[0]} ATK)`); }
    // Cộng hưởng với đội hình hiện tại
    if (sp.d.includes("TIÊN ĐAN") && boardTags.has("TIENDAN")) { v += 6; why.push("đội đang chạy hệ Tiên Đan"); }
    if (sp.d.includes("LÁ CHẮN") && boardTags.has("LACHAN")) { v += 5; why.push("kích được các thẻ ăn Lá Chắn"); }
    if ((sp.d.includes("TRIỆU TẬP") || sp.d.includes("TRIỆU HỒI") || sp.d.includes("riệu hồi")) && boardTags.has("TRIEUHOI")) { v += 5; why.push("kích chuỗi Triệu hồi"); }
    if (sp.d.includes("TÁI SINH") && boardTags.has("TAISINH")) { v += 5; why.push("khớp hệ Tái Sinh"); }
    if (eff.type === "manual" && sp.d.includes("Vàng")) { v += 3; why.push("kinh tế vàng"); }
    Object.keys(TRIBE_META).forEach((t) => { if (sp.d.includes(t) && boardCells.some((c) => UNITS[c.id].t === t)) { v += 4; why.push(`nhắm đúng tộc ${TRIBE_META[t].l} đang chơi`); } });
    if (price === 0 && sp.p === 0 && ovr.prices[sid] === undefined) why.push("⚠ phép chưa có giá (đang tính 0v) — cập nhật giá ở tab Danh sách");
    if (v >= 4) actions.push({ pri: 50 + v, txt: `Mua phép "${sp.n}" (${price} vàng): ${why.join("; ")}.` });
  });

  // --- 4a. Đơn vị đặc thù Daehan & Hấp Thụ chủ động ---
  g.board.forEach((c, bi) => {
    if (!c) return;
    const u = UNITS[c.id];
    if (u.tags.includes("HANDSUMM"))
      actions.push({ pri: 74, txt: `"${u.n}" đang chiếm 1 ô sân nhưng hiệu ứng của nó là TỰ TRIỆU HỒI từ Túi khi có ô trống trong trận — nên giữ trong Túi để vừa tiết kiệm ô vừa vào sân đúng lúc.` });
    if (u.tags.includes("ABSORBT")) {
      let bestT = null, bestVal = -Infinity;
      g.board.forEach((t, ti) => {
        if (!t || ti === bi) return;
        const tu = UNITS[t.id];
        const [ta, th] = effStats(ovr, t);
        const fxVal = ((tu.fx && tu.fx[t.lv]) || []).reduce((s, f) => s + (f.a + f.h) * Math.min(f.lim || 3, 3), 0);
        const val = ta + th - fxVal * 1.5 - tu.tags.length * 2; // chỉ số cao, ít hiệu ứng → mất ít nhất
        if (val > bestVal) { bestVal = val; bestT = { t, tu, ta, th }; }
      });
      if (bestT)
        actions.push({ pri: 68, txt: `"${u.n}" có HẤP THỤ chủ động: nên nuốt "${bestT.tu.n}" (+${bestT.ta}/+${bestT.th} cộng thẳng vào "${u.n}"; mục tiêu này nhiều chỉ số nhưng ít hiệu ứng nên hy sinh thiệt nhất). Mở "${u.n}" → nút Hấp Thụ.` });
    }
  });
  g.hand.forEach((it) => {
    if (it.k !== "u") return;
    const u = UNITS[it.id];
    if (u.tags.includes("HANDSUMM")) notes.push(`"${u.n}" đang ở đúng chỗ trong Túi — nó sẽ tự vào sân khi có ô trống trong trận.`);
    if (u.tags.includes("HANDGROW")) notes.push(`"${u.n}" lớn lên mỗi khi thêm thẻ vào tay — càng mua/nhận nhiều thẻ trước khi triển khai càng lợi (app tự cộng).`);
  });

  // --- 4b. Phép / Tiên Đan đang có trong Túi ---
  g.hand.forEach((it) => {
    if (it.k === "u") return;
    const src = it.k === "s" ? SPELLS[it.id] : DANS[it.id];
    const eff = src.eff || { type: "manual" };
    if (eff.type === "gold") actions.push({ pri: 90, txt: `Dùng "${src.n}" trong Túi ngay: +${eff.n} vàng để chi tiêu vòng này.` });
    else if (eff.type === "discover") actions.push({ pri: 72, txt: `Dùng "${src.n}" (Triệu Tập) — bấm Dùng rồi điền 3 lựa chọn game đưa ra, app sẽ chấm điểm nên lấy lá nào.` });
    else if (eff.type === "buff" && eff.tg === "shop") actions.push({ pri: 66, txt: `Dùng "${src.n}" để buff quân trong Thánh Đền — dùng TRƯỚC KHI mua để quân mang theo chỉ số cộng.` });
    else if ((eff.type === "buff" || eff.type === "double") && strongest) {
      const tgtTxt = eff.tg === "all" ? `toàn bộ ${boardCells.length} quân trên sân` : `"${UNITS[strongest.id].n}" (tổng chỉ số cao nhất)`;
      const valTxt = eff.type === "double" ? "gấp đôi ATK" : `+${eff.a || 0}/+${eff.h || 0}`;
      actions.push({ pri: 64 + (eff.tg === "all" ? boardCells.length : 2), txt: `Dùng "${src.n}" (${valTxt}) lên ${tgtTxt}${eff.temp ? " — buff tạm, dùng ngay trước trận" : ""}.` });
    }
  });

  // --- 4c. Tối ưu theo Thần Bảo Hộ đã chọn ---
  if (g.guardian) {
    const gu = g.guard;
    const tagCount = (tag) => boardCells.filter((c) => UNITS[c.id].tags.includes(tag)).length;
    if (g.guardian === "HORUS" && !gu.cd && g.gold >= 4 + 3)
      actions.push({ pri: 58, txt: `Mắt thần Horus (4 vàng): Triệu Tập đơn vị cấp ${Math.min(g.temple + 1, 6)} — cách duy nhất lấy quân trên cấp đền, đáng dùng khi dư vàng sau khi mua.` });
    if (g.guardian === "RA") {
      const n = tagCount("TRIEUHOI");
      if (n) actions.push({ pri: 56, txt: `RA buff +1/+1 và KHIÊU KHÍCH cho MỖI đơn vị được triệu hồi trong trận — đội có ${n} thẻ hệ Triệu hồi, ưu tiên mua thêm thẻ hệ này để nhân giá trị nội tại.` });
      else notes.push("RA cần thẻ hệ Triệu hồi để phát huy — hiện đội chưa có thẻ nào.");
    }
    if (g.guardian === "ENLIL" && !gu.enlil) {
      let best = null, bestV = -1;
      boardCells.forEach((c) => { if (c.lv < 2) { const [a, h] = effStats(ovr, c); const v = (a + h) * (UNITS[c.id].c + 1); if (v > bestV) { bestV = v; best = c; } } });
      if (best) actions.push({ pri: 61, txt: `ENLIL (miễn phí, 1 lần/ván): thăng cấp "${UNITS[best.id].n}" lên lv${best.lv + 2} — tiết kiệm ${best.lv === 0 ? "2 lá nhân bản (6 vàng)" : "1 lá nhân bản (3 vàng)"}. Đừng lãng phí vào quân sắp thay.` });
    }
    if (g.guardian === "ISHTAR") notes.push("ISHTAR cho 9 mạng — có thể chơi tham kinh tế (giữ vàng, lên đền sớm) và chấp nhận thua vài vòng đầu.");
    if (g.guardian === "ZEUS") {
      actions.push({ pri: 54, txt: `ZEUS: sát thương Tia chớp hiện tại ${3 + 3 * gu.spells} (3 + 3 × ${gu.spells} phép đã dùng) — mua phép rẻ cũng đáng để cộng dồn; kích (1 vàng) trước những trận quan trọng.` });
    }
    if (g.guardian === "ODIN") notes.push(`ODIN: ưu tiên thẻ hệ Kết Liễu (đội đang có ${tagCount("KETLIEU")}) — đủ 15 kết liễu / 9 lần kích hoạt thì tự thêm thẻ "PHẦN THƯỞNG THĂNG CẤP" vào Túi qua nút + Thêm.`);
    if (g.guardian === "NHỊ LANG THẦN") notes.push(`NHỊ LANG THẦN: đã dùng ${gu.dan}/20 Tiên Đan (app tự đếm) — ưu tiên thẻ tạo đan (đội đang có ${tagCount("TIENDAN")} thẻ hệ Tiên Đan).`);
    if (g.guardian === "SET") {
      const niles = boardCells.filter((c) => UNITS[c.id].t === "NILES");
      if (niles.length && !gu.cd) {
        let best = null, bestV = -Infinity;
        niles.forEach((c) => { const contrib = (() => { const b2 = g.board.map((x) => (x === c ? null : x)); return cur.total - scoreBoard(b2, ovr).total; })(); const v = UNITS[c.id].c * 3 - contrib; if (v > bestV) { bestV = v; best = c; } });
        if (best) actions.push({ pri: 57, txt: `SET Cắt xén (${gu.setCost} vàng): nên phá hủy "${UNITS[best.id].n}" (cấp ${UNITS[best.id].c}, đóng góp thấp so với cấp) → toàn bộ NILES +${UNITS[best.id].c} ATK vĩnh viễn, kể cả quân mua sau. Buff tích lũy hiện tại: +${gu.nilesBuff} ATK.` });
      }
      if (gu.setCost === 0 && !gu.cd) actions.push({ pri: 80, txt: "SET Cắt xén đang MIỄN PHÍ (giá đã giảm về 0) — dùng ngay nếu có NILES đáng hy sinh." });
    }
    if (g.guardian === "ANU" && !gu.cd && g.gold >= 2 && weakest)
      actions.push({ pri: 55, txt: `ANU Thăng hoa (2 vàng): biến "${UNITS[weakest.cell.id].n}" (đóng góp thấp nhất: ${weakest.contrib} điểm) thành 1 đơn vị bậc cao hơn bạn thấy trong đền/muốn có.` });
    if (g.guardian === "NERGAL" && !gu.cd) {
      const shopHas = (g.shop.units || []).filter(Boolean).length;
      if (shopHas) actions.push({ pri: 56, txt: `NERGAL (1 vàng): khóa quân trong đền bạn muốn nhưng chưa cần ngay — được +2/+2 và né 3 vàng tiền mua, đổi lại 🔒 2 lượt không dùng được. Hợp với quân định ghép cặp sau.` });
    }
  }

  // --- 5. Kinh tế: lên đền / đổi lại ---
  const cost = upCost(g.temple, g.sinceUp);
  if (cost !== null) {
    const newAtNext = UNITS.filter((u) => !u.sum && u.c === g.temple + 1 && (g.tribes.includes(u.t) || u.t === "NEUTRAL")).length;
    if (cost === 0) actions.push({ pri: 99, txt: `Lên Thánh Đền cấp ${g.temple + 1} MIỄN PHÍ (giá đã giảm về 0) — mở ${newAtNext} đơn vị mới.` });
    else if (g.gold >= cost + 3) actions.push({ pri: 45, txt: `Đủ vàng để lên đền cấp ${g.temple + 1} (${cost} vàng, mở ${newAtNext} đơn vị mới) mà vẫn mua được quân.` });
    else notes.push(`Lên đền cấp ${g.temple + 1} cần ${cost} vàng (giảm 1 mỗi vòng chờ).`);
  }
  const shopFilled = (g.shop.units || []).filter(Boolean).length + (g.shop.spells || []).filter((x) => x !== null && x !== undefined).length;
  const bestShopPri = Math.max(0, ...actions.filter((a) => a.pri >= 50 && a.pri < 96).map((a) => a.pri));
  if (shopFilled > 0 && bestShopPri < 58 && g.gold >= 4 && !g.frozen) {
    actions.push({ pri: 40, txt: `Shop hiện tại không có gì đáng mua (điểm cao nhất thấp) — Đổi lại (1 vàng) để tìm lá ghép cặp hoặc lá cùng hệ.` });
  }
  // Shop còn nhiều đồ giá trị nhưng không đủ vàng mua hết → gợi ý đóng băng
  if (!g.frozen && shopFilled > 0) {
    const goodBuys = actions.filter((a) => a.pri >= 58 && a.pri < 96 && a.txt.startsWith("Mua")).length;
    if (goodBuys >= 2 && g.gold < goodBuys * 3) {
      actions.push({ pri: 44, txt: `Shop có ${goodBuys} món đáng mua nhưng chỉ có ${g.gold} vàng — mua món giá trị nhất rồi ❄ ĐÓNG BĂNG để giữ phần còn lại.` });
    }
  }
  if (g.frozen) notes.push("Thánh Đền đang ❄ đóng băng — hàng còn lại sẽ giữ nguyên sang vòng sau.");

  // --- 6. Xác suất tìm lá ---
  const pool = UNITS.filter((u) => !u.sum && u.c >= 1 && u.c <= g.temple && (g.tribes.includes(u.t) || u.t === "NEUTRAL"));
  const slots = SHOP_UNIT_SLOTS[g.temple];
  if (pool.length) {
    const p1 = (1 - Math.pow(1 - 1 / pool.length, slots)) * 100;
    notes.push(`Pool hiện tại ${pool.length} lá, mỗi lần đổi lại (${slots} ô) có ~${p1.toFixed(1)}% ra 1 lá cụ thể.`);
  }

  actions.sort((a, b) => b.pri - a.pri);
  return { actions, notes, cur };
}

function positionWarnings(board, ovr) {
  const warns = [];
  board.forEach((cell, i) => {
    if (!cell) return;
    const u = UNITS[cell.id];
    const [atk, hp] = effStats(ovr, cell);
    const kws = effKw(cell);
    const front = i < 3;
    const wantsBack = kws.includes("TẦM XA") || kws.includes("KHÔNG THỂ TẤN CÔNG") || kws.includes("ẨN THÂN");
    const wantsFront = kws.includes("KHIÊU KHÍCH");
    if (front && wantsBack && !wantsFront) warns.push(`${u.n}: nên xuống hàng sau (${kws.filter((k) => ["TẦM XA", "KHÔNG THỂ TẤN CÔNG", "ẨN THÂN"].includes(k)).join("/")}).`);
    else if (front && !wantsFront && atk >= 2 * hp) warns.push(`${u.n}: ${atk}/${hp} giòn — cân nhắc hàng sau.`);
    if (!front && wantsFront) warns.push(`${u.n}: có KHIÊU KHÍCH — nên lên hàng trước.`);
    if (!front && hp >= 2 * atk && !wantsBack) warns.push(`${u.n}: trâu (${atk}/${hp}) — nên lên hàng trước đỡ đòn.`);
  });
  return warns;
}

/* ============ COMPONENT PHỤ ============ */
function Chip({ active, color, onClick, children }) {
  return (
    <button onClick={onClick} className="px-3 py-1.5 rounded-full text-xs font-bold border"
      style={{ borderColor: active ? color : COL.line, background: active ? color + "22" : "transparent", color: active ? color : COL.mut }}>
      {children}
    </button>
  );
}
function Card({ title, right, children }) {
  return (
    <div className="rounded-2xl p-4 mb-3" style={{ background: COL.panel, border: `1px solid ${COL.line}` }}>
      {(title || right) && (
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-extrabold" style={{ ...DISP, color: COL.mut }}>{title}</div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
function Stepper({ value, onChange, min = 0, max = 999, color = COL.ink, small }) {
  const sz = small ? "w-7 h-7 text-base" : "w-9 h-9 text-lg";
  return (
    <div className="flex items-center gap-2">
      <button className={`${sz} rounded-xl font-bold`} style={{ background: COL.panel2, color: COL.mut, border: `1px solid ${COL.line}` }}
        onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <div className={`${small ? "text-base w-8" : "text-2xl w-10"} font-extrabold text-center`} style={{ ...NUM, color }}>{value}</div>
      <button className={`${sz} rounded-xl font-bold`} style={{ background: COL.panel2, color: COL.mut, border: `1px solid ${COL.line}` }}
        onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

/* ============ PICKER (quân / phép / đan) ============ */
function CardPicker({ game, ovr, kinds, onPick, onClose, restrictTemple }) {
  const [kind, setKind] = useState(kinds[0]);
  const [q, setQ] = useState("");
  const [tribe, setTribe] = useState(null);
  const [allTiers, setAllTiers] = useState(!restrictTemple);
  const activeTribes = game.tribes.length ? [...game.tribes, "NEUTRAL"] : Object.keys(TRIBE_META);

  const list = useMemo(() => {
    if (kind === "u") {
      let l = UNITS.filter((u) => u.c >= 1);
      if (!allTiers) l = l.filter((u) => u.c <= game.temple && !u.sum && activeTribes.includes(u.t));
      if (tribe) l = l.filter((u) => u.t === tribe);
      if (q) l = l.filter((u) => u.n.toLowerCase().includes(q.toLowerCase()));
      return l.sort((a, b) => b.c - a.c || a.n.localeCompare(b.n));
    }
    const src = kind === "s" ? SPELLS : DANS;
    let l = src;
    if (q) l = l.filter((s) => s.n.toLowerCase().includes(q.toLowerCase()));
    return [...l].sort((a, b) => b.c - a.c);
  }, [kind, q, tribe, allTiers, game.temple, game.tribes]);

  const KIND_LABEL = { u: "Quân", s: "Phép", d: "Tiên Đan" };
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(8,10,16,0.94)" }}>
      <div className="p-4 flex items-center gap-2">
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm thẻ..."
          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
          style={{ background: COL.panel, color: COL.ink, border: `1px solid ${COL.line}` }} />
        <button onClick={onClose} className="px-4 py-3 rounded-xl text-sm font-bold" style={{ background: COL.panel, color: COL.mut, border: `1px solid ${COL.line}` }}>Đóng</button>
      </div>
      {kinds.length > 1 && (
        <div className="px-4 pb-2 flex gap-2">
          {kinds.map((k) => <Chip key={k} active={kind === k} color={COL.gold} onClick={() => setKind(k)}>{KIND_LABEL[k]}</Chip>)}
        </div>
      )}
      {kind === "u" && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          <Chip active={allTiers} color={COL.purple} onClick={() => setAllTiers(!allTiers)}>Mọi cấp/tộc</Chip>
          <Chip active={!tribe} color={COL.gold} onClick={() => setTribe(null)}>Tất cả</Chip>
          {(allTiers ? Object.keys(TRIBE_META) : activeTribes).map((t) => (
            <Chip key={t} active={tribe === t} color={TRIBE_META[t].c} onClick={() => setTribe(tribe === t ? null : t)}>{TRIBE_META[t].l}</Chip>
          ))}
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {list.map((it) => {
          if (kind === "u") {
            const u = it; const bs = baseStats(ovr, u.id);
            return (
              <button key={u.id} onClick={() => onPick("u", u)} className="w-full text-left rounded-xl p-3 mb-2 flex items-center gap-3"
                style={{ background: COL.panel, border: `1px solid ${COL.line}`, borderLeft: `3px solid ${TRIBE_META[u.t].c}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0"
                  style={{ background: TRIBE_META[u.t].c + "26", color: TRIBE_META[u.t].c, ...NUM }}>{u.c || "TH"}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate" style={{ color: COL.ink }}>{u.n}{u.sum ? " ⟡" : ""}</div>
                  <div className="text-xs truncate" style={{ color: COL.mut }}>{TRIBE_META[u.t].l} · {bs[0][0]}/{bs[0][1]} → {bs[2][0]}/{bs[2][1]}</div>
                </div>
              </button>
            );
          }
          const price = kind === "s" ? spellPrice(ovr, it.id) : null;
          return (
            <button key={it.id} onClick={() => onPick(kind, it)} className="w-full text-left rounded-xl p-3 mb-2"
              style={{ background: COL.panel, border: `1px solid ${COL.line}`, borderLeft: `3px solid ${kind === "s" ? COL.purple : COL.gold}` }}>
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold" style={{ color: COL.ink }}>{it.n}</div>
                <div className="text-[10px] font-extrabold" style={{ ...NUM, color: kind === "s" ? COL.purple : COL.gold }}>
                  Cấp {it.c}{kind === "s" ? ` · ${price}v` : ""}
                </div>
              </div>
              <div className="text-[11px] mt-1 leading-snug" style={{ color: COL.mut }}>{it.d}</div>
            </button>
          );
        })}
        {!list.length && <div className="text-center text-sm mt-8" style={{ color: COL.mut }}>Không tìm thấy thẻ nào.</div>}
      </div>
    </div>
  );
}

/* ============ MÔ PHỎNG ĐẤU 1v1 ============ */
function simDuel(aIn, bIn, firstA, ovr) {
  const mk = (x) => {
    const bs = baseStats(ovr, x.id)[x.lv];
    const u = UNITS[x.id];
    return { n: u.n, atk: bs[0] + (x.dA || 0), hp: bs[1] + (x.dH || 0), kw: [...u.kw, ...(x.xk || [])], fx: ((u.fx && u.fx[x.lv]) || []).filter((f) => f.tg === "self" && f.tr !== "SHOP"), used: {} };
  };
  const A = mk(aIn), B = mk(bIn);
  [A, B].forEach((s) => { s.shield = s.kw.includes("LÁ CHẮN"); s.venom = s.kw.includes("HIỂM ĐỘC"); });
  const log = [];
  const gain = (s, tr) => {
    s.fx.forEach((f, i) => {
      if (f.tr !== tr) return;
      s.used[i] = s.used[i] || 0;
      if (f.lim && s.used[i] >= f.lim) return;
      s.used[i]++;
      s.atk += f.a; s.hp += f.h;
      log.push(`   ✦ ${s.n} kích hoạt hiệu ứng: +${f.a}/+${f.h} → ${s.atk}/${s.hp}`);
    });
  };
  const dealDmg = (src, dst, dmg) => {
    if (dst.shield) { dst.shield = false; log.push(`   🛡 ${dst.n} chặn toàn bộ bằng LÁ CHẮN`); return; }
    dst.hp -= dmg;
    if (dst.hp > 0) gain(dst, "HIT");
    if (src.venom && dmg > 0 && dst.hp > 0) { src.venom = false; dst.hp = 0; log.push(`   ☠ HIỂM ĐỘC của ${src.n} hủy diệt ${dst.n}`); }
  };
  const attack = (att, def) => {
    gain(att, "ATK");
    log.push(`▶ ${att.n} [${att.atk}/${Math.max(att.hp, 0)}] tấn công ${def.n} [${def.atk}/${Math.max(def.hp, 0)}]`);
    dealDmg(att, def, att.atk);
    if (def.hp > 0) gain(att, "DMG");
    log.push(`   ${def.n} còn ${Math.max(def.hp, 0)} máu`);
    if (def.hp <= 0) { gain(att, "KILL"); return; }
    if (!att.kw.includes("TẦM XA") && !def.kw.includes("TẦM XA")) {
      gain(def, "CTR");
      log.push(`   ↩ ${def.n} phản công (${def.atk} sát thương)`);
      dealDmg(def, att, def.atk);
      log.push(`   ${att.n} còn ${Math.max(att.hp, 0)} máu`);
      if (att.hp <= 0) gain(def, "KILL");
    }
  };
  gain(A, "OPEN"); gain(B, "OPEN");
  let turnA = firstA, rounds = 0;
  const cantA = A.kw.includes("KHÔNG THỂ TẤN CÔNG"), cantB = B.kw.includes("KHÔNG THỂ TẤN CÔNG");
  while (A.hp > 0 && B.hp > 0 && rounds < 30) {
    rounds++;
    log.push(`— Lượt ${rounds} —`);
    if (turnA) { if (!cantA) attack(A, B); else log.push(`${A.n} KHÔNG THỂ TẤN CÔNG — bỏ lượt`); }
    else { if (!cantB) attack(B, A); else log.push(`${B.n} KHÔNG THỂ TẤN CÔNG — bỏ lượt`); }
    turnA = !turnA;
    if (cantA && cantB) break;
  }
  const res = A.hp <= 0 && B.hp <= 0 ? "⚖ Hai bên cùng gục"
    : A.hp <= 0 ? `${B.n} THẮNG (còn ${B.hp}/${B.atk} → ${B.atk}/${B.hp})`
    : B.hp <= 0 ? `${A.n} THẮNG (còn ${A.atk}/${A.hp})`
    : "⚖ Không phân thắng bại sau 30 lượt";
  return { log, res };
}

/* ============ ĐÁNH GIÁ LỰA CHỌN TRIỆU TẬP ============ */
function evalDiscover(g, ovr, id) {
  const cur = scoreBoard(g.board, ovr);
  const u = UNITS[id];
  let delta = 0; const reasons = [];
  const empty = g.board.findIndex((x) => !x);
  if (empty >= 0) { const b2 = [...g.board]; b2[empty] = { id, lv: 0, dA: 0, dH: 0 }; delta = scoreBoard(b2, ovr).total - cur.total; }
  const owned = g.board.filter(Boolean).some((c) => c.id === id) || g.hand.some((it) => it.k === "u" && it.id === id);
  if (owned) { delta += 6; reasons.push("trùng thẻ đang có → tiến gần nâng cấp"); }
  const boardTags = new Set();
  g.board.filter(Boolean).forEach((c) => UNITS[c.id].tags.forEach((t) => boardTags.add(t)));
  const shared = u.tags.filter((t) => boardTags.has(t) && TAG_LABEL[t]);
  if (shared.length) { delta += shared.length * 2; reasons.push("khớp hệ " + shared.map((t) => TAG_LABEL[t]).join(", ")); }
  if (u.tags.includes("HANDSUMM")) reasons.push("giữ trong Túi — tự vào sân khi có ô trống");
  return { delta: Math.round(delta), reasons };
}

/* ============ CHỌN MỤC TIÊU CHO PHÉP / TIÊN ĐAN ============ */
function TargetPicker({ g, ovr, pending, onPick, onClose }) {
  const exB = pending.abs && pending.abs.where === "board" ? pending.abs.index : -1;
  const exH = pending.abs && pending.abs.where === "hand" ? pending.abs.index : (pending.handIndex ?? -1);
  const boardUs = g.board.map((c, i) => ({ c, i })).filter((x) => x.c && x.i !== exB && (!pending.tribe || UNITS[x.c.id].t === pending.tribe));
  const handUs = g.hand.map((c, i) => ({ c, i })).filter((x) => x.c.k === "u" && x.i !== exH && (!pending.tribe || UNITS[x.c.id].t === pending.tribe));
  const Row = ({ c, onClick }) => {
    const u = UNITS[c.id]; const st = effStats(ovr, c);
    return (
      <button onClick={onClick} className="w-full text-left rounded-xl p-2.5 mb-1.5 flex items-center gap-2.5"
        style={{ background: COL.panel2, border: `1px solid ${COL.line}`, borderLeft: `3px solid ${TRIBE_META[u.t].c}` }}>
        <span className="text-xs font-bold flex-1" style={{ color: COL.ink }}>{u.n}</span>
        <span className="text-[10px] font-extrabold" style={{ ...NUM, color: TRIBE_META[u.t].c }}>{st[0]}/{st[1]} lv{c.lv + 1}</span>
      </button>
    );
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(8,10,16,0.85)" }} onClick={onClose}>
      <div className="w-full rounded-t-3xl p-5 max-h-[75vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ background: COL.panel, borderTop: `2px solid ${COL.purple}` }}>
        <div className="text-sm font-extrabold mb-1" style={{ color: COL.ink }}>Chọn mục tiêu — "{pending.name}"</div>
        <div className="text-[11px] mb-3" style={{ color: COL.mut }}>
          {pending.eff.type === "enlil" ? "Thăng 1 cấp cho đồng minh được chọn (lv1→2, lv2→3)"
            : pending.eff.type === "set" ? `Phá hủy mục tiêu — mọi đơn vị NILES +ATK bằng CẤP của nó (tốn ${g.guard.setCost} vàng)`
            : pending.eff.type === "anu1" ? "Bước 1/2: chọn đơn vị bậc thấp sẽ bị biến hình"
            : pending.eff.type === "absorb" ? "HẤP THỤ: cộng toàn bộ chỉ số của mục tiêu vào đơn vị này, mục tiêu bị loại bỏ"
            : pending.eff.type === "double" ? "Gấp đôi SÁT THƯƠNG của mục tiêu"
            : `+${pending.finalA}/+${pending.finalH}${pending.isDan && (g.danBonus.a || g.danBonus.h) ? " (đã cộng chỉ số cộng thêm Tiên Đan)" : ""}`}
          {pending.eff.kw && pending.eff.kw.length ? ` · ban passive: ${pending.eff.kw.join(", ")}` : ""}
          {pending.eff.temp ? " · buff tạm thời — hết hạn nhớ tự gỡ" : ""}
        </div>
        {boardUs.length > 0 && <div className="text-[9px] font-bold mb-1" style={{ ...DISP, color: COL.mut }}>Trên sân</div>}
        {boardUs.map((x) => <Row key={"b" + x.i} c={x.c} onClick={() => onPick("board", x.i)} />)}
        {handUs.length > 0 && <div className="text-[9px] font-bold mb-1 mt-2" style={{ ...DISP, color: COL.mut }}>Trong túi</div>}
        {handUs.map((x) => <Row key={"h" + x.i} c={x.c} onClick={() => onPick("hand", x.i)} />)}
        {!boardUs.length && !handUs.length && <div className="text-xs mb-3" style={{ color: COL.mut }}>Không có quân nào để nhận buff.</div>}
        <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-bold mt-1" style={{ background: COL.panel2, color: COL.ink }}>Hủy</button>
      </div>
    </div>
  );
}

/* ============ SHEET CHI TIẾT QUÂN (sân hoặc túi) ============ */
function UnitSheet({ ctx, ovr, onUpdate, onAction, onClose }) {
  // ctx: {where:'board'|'hand', index, cell}
  const cell = ctx.cell;
  const u = UNITS[cell.id];
  const bs = baseStats(ovr, cell.id);
  const [a, h] = effStats(ovr, cell);
  return (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(8,10,16,0.8)" }} onClick={onClose}>
      <div className="w-full rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}
        style={{ background: COL.panel, borderTop: `2px solid ${TRIBE_META[u.t].c}` }}>
        <div className="flex items-center justify-between mb-1">
          <div className="text-base font-extrabold" style={{ color: COL.ink }}>{u.n}</div>
          <div className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: TRIBE_META[u.t].c + "26", color: TRIBE_META[u.t].c }}>
            {TRIBE_META[u.t].l} · Cấp {u.c || "—"}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {u.kw.map((k) => <span key={k} className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: COL.panel2, color: COL.blue }}>{k}</span>)}
          {(cell.xk || []).map((k) => <span key={k} className="text-[10px] font-bold px-2 py-0.5 rounded" style={{ background: COL.gold + "22", color: COL.gold }}>{k} ✦</span>)}
        </div>
        <div className="rounded-xl p-3 mb-3" style={{ background: COL.panel2 }}>
          <div className="text-[10px] font-bold mb-2" style={{ ...DISP, color: COL.mut }}>Passive nhận thêm (từ phép / hiệu ứng) — chạm để bật/tắt</div>
          <div className="flex flex-wrap gap-1.5">
            {KW_ALL.filter((k) => !u.kw.includes(k)).map((k) => {
              const on = (cell.xk || []).includes(k);
              return (
                <button key={k} onClick={() => onUpdate({ ...cell, xk: on ? (cell.xk || []).filter((x) => x !== k) : [...(cell.xk || []), k] })}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: on ? COL.gold + "26" : COL.panel, color: on ? COL.gold : COL.mut, border: `1px solid ${on ? COL.gold : COL.line}` }}>{k}</button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 mb-3">
          {[0, 1, 2].map((lv) => (
            <button key={lv} onClick={() => onUpdate({ ...cell, lv })} className="flex-1 rounded-xl p-2.5 text-center"
              style={{ background: cell.lv === lv ? COL.gold + "1F" : COL.panel2, border: `1px solid ${cell.lv === lv ? COL.gold : COL.line}` }}>
              <div className="text-[10px] font-bold" style={{ color: cell.lv === lv ? COL.gold : COL.mut, ...DISP }}>lv{lv + 1}</div>
              <div className="text-sm font-extrabold" style={{ ...NUM, color: COL.ink }}>{bs[lv][0]}/{bs[lv][1]}</div>
            </button>
          ))}
        </div>
        <div className="rounded-xl p-3 mb-3" style={{ background: COL.panel2 }}>
          <div className="text-[10px] font-bold mb-2" style={{ ...DISP, color: COL.mut }}>Chỉ số thực (gốc + cường hóa)</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold w-8" style={{ color: COL.red }}>ATK</span>
              <Stepper small value={a} min={0} color={COL.red} onChange={(v) => onUpdate({ ...cell, dA: v - bs[cell.lv][0] })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold w-8" style={{ color: COL.green }}>MÁU</span>
              <Stepper small value={h} min={0} color={COL.green} onChange={(v) => onUpdate({ ...cell, dH: v - bs[cell.lv][1] })} />
            </div>
          </div>
          {(cell.dA || cell.dH) ? (
            <div className="text-[10px] mt-2 flex items-center justify-between" style={{ color: COL.mut }}>
              <span>cường hóa: {cell.dA >= 0 ? "+" : ""}{cell.dA || 0}/{cell.dH >= 0 ? "+" : ""}{cell.dH || 0}</span>
              <button className="font-bold underline" style={{ color: COL.blue }} onClick={() => onUpdate({ ...cell, dA: 0, dH: 0 })}>đặt lại</button>
            </div>
          ) : null}
        </div>
        <div className="text-xs leading-relaxed mb-4 rounded-xl p-3" style={{ background: COL.panel2, color: COL.ink }}>{u.k[cell.lv]}</div>
        <div className="grid grid-cols-2 gap-2">
          {u.k[cell.lv].includes("HẤP THỤ") && !u.k[cell.lv].includes("ngẫu nhiên") &&
            <button onClick={() => onAction("absorb")} className="py-3 rounded-xl text-sm font-bold" style={{ background: COL.purple + "22", color: COL.purple }}>Hấp Thụ đồng minh</button>}
          {ctx.where === "hand" && <button onClick={() => onAction("deploy")} className="py-3 rounded-xl text-sm font-bold" style={{ background: COL.green + "22", color: COL.green }}>Triển khai</button>}
          {ctx.where === "board" && <button onClick={() => onAction("move")} className="py-3 rounded-xl text-sm font-bold" style={{ background: COL.blue + "22", color: COL.blue }}>Đổi ô</button>}
          <button onClick={() => onAction("sell")} className="py-3 rounded-xl text-sm font-bold" style={{ background: COL.gold + "22", color: COL.gold }}>Bán (+1 vàng)</button>
          <button onClick={() => onAction("remove")} className="py-3 rounded-xl text-sm font-bold" style={{ background: COL.red + "22", color: COL.red }}>Xóa (không hoàn vàng)</button>
          <button onClick={onClose} className="py-3 rounded-xl text-sm font-bold" style={{ background: COL.panel2, color: COL.ink }}>Xong</button>
        </div>
      </div>
    </div>
  );
}

/* ============ APP ============ */
export default function App() {
  const [tab, setTab] = useState("tran");
  const [game, setGame] = useState(DEFAULT_GAME);
  const [ovr, setOvr] = useState(DEFAULT_OVR);
  const [logs, setLogs] = useState({ shop: [], rounds: [], games: [] });
  const [loaded, setLoaded] = useState(false);
  const [picker, setPicker] = useState(null);
  const [sheet, setSheet] = useState(null); // {where,index}
  const [moveFrom, setMoveFrom] = useState(null);
  const [pendingUse, setPendingUse] = useState(null);
  const [duel, setDuel] = useState({ a: null, b: null, first: "a", out: null });
  const [discover, setDiscover] = useState(null); // {handIndex, name, slots:[id|null x3]}
  const [nergal, setNergal] = useState(false);
  const [anuFrom, setAnuFrom] = useState(null); // {where, index}
  const [toast, setToast] = useState(null);
  const [listKind, setListKind] = useState("u");
  const [openTribe, setOpenTribe] = useState(null);
  const [editUnit, setEditUnit] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    (async () => {
      const g = await stGet("mt-state");
      const l = await stGet("mt-logs");
      const o = await stGet("mt-ovr");
      if (g) setGame({ ...DEFAULT_GAME, ...g, shop: { units: [], spells: [], ...(g.shop || {}) }, guard: { ...DEFAULT_GAME.guard, ...(g.guard || {}) } });
      if (l) setLogs({ shop: [], rounds: [], games: [], ...l });
      if (o) setOvr({ ...DEFAULT_OVR, ...o });
      setLoaded(true);
    })();
  }, []);
  useEffect(() => { if (loaded) stSet("mt-state", game); }, [game, loaded]);
  useEffect(() => { if (loaded) stSet("mt-logs", logs); }, [logs, loaded]);
  useEffect(() => { if (loaded) stSet("mt-ovr", ovr); }, [ovr, loaded]);

  const flash = (m) => { setToast(m); if (toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToast(null), 2200); };

  const g = game;
  const inSurvival = g.phase === "sinhton";
  const cost = upCost(g.temple, g.sinceUp);
  const unitSlots = SHOP_UNIT_SLOTS[g.temple];
  const hasScholar = g.board.some((c) => c && UNITS[c.id].n === "HỌC GIẢ HY LẠP");
  const spellSlots = 1 + (hasScholar ? 1 : 0);

  const shopUnits = Array.from({ length: unitSlots }, (_, i) => (g.shop.units || [])[i] || null);
  const shopSpells = Array.from({ length: spellSlots }, (_, i) => { const v = (g.shop.spells || [])[i]; return v === undefined ? null : v; });
  const sc = useMemo(() => scoreBoard(g.board, ovr), [g.board, ovr]);
  const plan = useMemo(() => buildPlan(g, ovr), [g, ovr]);

  /* ---- vòng / ván ---- */
  const endRound = (res) => { // 'W' thắng | 'L' thua | 'D' hòa
    setLogs((L) => ({ ...L, rounds: [...L.rounds, { round: g.round, phase: g.phase, result: res, ts: Date.now() }] }));
    setGame((G) => {
      let { wins, lives, phase, survivalPlayed } = G;
      if (res === "W") wins += 1;
      else if (res === "L" && phase === "thuthach") lives -= 1;
      // Hòa: không mất mạng, không tính thắng — vòng vẫn ghi nhận và trôi qua
      if (phase === "sinhton") survivalPlayed += 1;
      if (phase === "thuthach" && wins >= 15) phase = "sinhton";
      const round = G.round + 1;
      // Đóng băng: giữ nguyên hàng còn lại trong Thánh Đền sang vòng sau
      const shop = G.frozen ? G.shop : { units: [], spells: [] };
      const guard = { ...G.guard, cd: false, setUsed: false, setCost: G.guardian === "SET" ? Math.max(0, G.guard.setCost - (G.guard.setUsed ? 0 : 1)) : G.guard.setCost };
      const hand = G.hand.map((it) => (it.lock ? { ...it, lock: Math.max(0, it.lock - 1) } : it));
      return { ...G, round, wins, lives, phase, survivalPlayed, sinceUp: G.sinceUp + 1, gold: baseGold(round), shop, frozen: false, guard, hand };
    });
    flash(res === "W" ? `Đã ghi: thắng vòng ${g.round}` : res === "L" ? `Đã ghi: thua vòng ${g.round}` : `Đã ghi: hòa vòng ${g.round}`);
  };
  const endGame = (result) => {
    setLogs((L) => ({
      ...L, games: [...L.games, {
        ts: Date.now(), result, reachedRound: g.round, wins: g.wins, lives: g.lives, tribes: g.tribes, guardian: g.guardian,
        board: g.board.filter(Boolean).map((c) => ({ n: UNITS[c.id].n, lv: c.lv + 1 })),
        survival: g.phase === "sinhton" ? { total: g.survivalTotal, played: g.survivalPlayed } : null,
      }],
    }));
    setGame({ ...DEFAULT_GAME });
    flash("Đã lưu ván, bắt đầu ván mới");
  };

  /* ---- SANSIN-type: tự cộng chỉ số khi có thẻ mới vào tay ---- */
  const applyHandGrow = (hand) =>
    hand.map((it) => {
      if (it.k !== "u") return it;
      const u = UNITS[it.id];
      if (!u.tags.includes("HANDGROW")) return it;
      const f = ((u.fx && u.fx[it.lv]) || [])[0];
      if (!f) return it;
      return { ...it, dA: (it.dA || 0) + f.a, dH: (it.dH || 0) + f.h };
    });

  /* ---- dùng phép / tiên đan trong túi ---- */
  const HAO_ID = (UNITS.find((u) => u.n === "HẠO THIÊN KHUYỂN") || {}).id;
  const countUse = (G, kind) => {
    const guard = { ...G.guard };
    let hand = G.hand, msg = null;
    if (kind === "s") guard.spells += 1;
    if (kind === "d") {
      guard.dan += 1;
      if (G.guardian === "NHỊ LANG THẦN" && guard.dan >= 20 && HAO_ID !== undefined) {
        guard.dan -= 20;
        hand = [...hand, { k: "u", id: HAO_ID, lv: 0, dA: 0, dH: 0 }];
        msg = "🐕 Đủ 20 Tiên Đan — nhận 1 HẠO THIÊN KHUYỂN vào Túi (bộ đếm reset)";
      }
    }
    return { guard, hand, msg };
  };
  const playCard = (i) => {
    const it = g.hand[i];
    const src = it.k === "s" ? SPELLS[it.id] : DANS[it.id];
    const eff = src.eff || { type: "manual" };
    const isDan = it.k === "d";
    const bA = eff.a ? eff.a + (isDan ? g.danBonus.a : 0) : 0;
    const bH = eff.h ? eff.h + (isDan ? g.danBonus.h : 0) : 0;
    const cu = countUse(g, it.k);
    if (eff.type === "gold") {
      setGame({ ...g, gold: g.gold + eff.n, hand: cu.hand.filter((_, j) => j !== i), guard: cu.guard });
      flash(`"${src.n}": +${eff.n} vàng${cu.msg ? " · " + cu.msg : ""}`);
    } else if (eff.type === "buff" && eff.tg === "all") {
      const grant = eff.kw || [];
      const b = g.board.map((c) => (c ? { ...c, dA: (c.dA || 0) + bA, dH: (c.dH || 0) + bH, xk: [...new Set([...(c.xk || []), ...grant])] } : c));
      setGame({ ...g, board: b, hand: cu.hand.filter((_, j) => j !== i), guard: cu.guard });
      flash(`"${src.n}": +${bA}/+${bH}${grant.length ? " + " + grant.join(", ") : ""} cho toàn bộ quân trên sân${eff.temp ? " (buff tạm — nhớ gỡ sau)" : ""}${cu.msg ? " · " + cu.msg : ""}`);
    } else if (eff.type === "buff" && eff.tg === "shop") {
      setGame({ ...g, shopBuff: { a: g.shopBuff.a + bA, h: g.shopBuff.h + bH }, hand: cu.hand.filter((_, j) => j !== i), guard: cu.guard });
      flash(`"${src.n}": quân trong Thánh Đền +${bA}/+${bH}${cu.msg ? " · " + cu.msg : ""}`);
    } else if (eff.type === "discover") {
      setDiscover({ handIndex: i, name: src.n, slots: [null, null, null] });
      setTab("doihinh");
      flash(`Mục 🔮 Triệu Tập đã kích hoạt (tab Đội hình) — điền 3 lựa chọn`);
    } else if (eff.type === "buff" || eff.type === "double") {
      setPendingUse({ handIndex: i, eff, name: src.n, isDan, finalA: bA, finalH: bH });
    } else {
      setGame({ ...g, hand: cu.hand.filter((_, j) => j !== i), guard: cu.guard });
      flash(`Đã dùng "${src.n}" — hiệu ứng đặc biệt, áp dụng thủ công theo mô tả thẻ${cu.msg ? " · " + cu.msg : ""}`);
    }
  };
  const applyPending = (where, index) => {
    const p = pendingUse; if (!p) return;
    const tgt = where === "board" ? g.board[index] : g.hand[index];
    if (!tgt) return;
    if (p.eff.type === "enlil") {
      if (tgt.lv >= 2) { flash("Đơn vị đã lv3 tối đa"); return; }
      const upd = { ...tgt, lv: tgt.lv + 1 };
      let board = g.board, hand = [...g.hand];
      if (where === "board") { board = [...g.board]; board[index] = upd; } else hand[index] = upd;
      setGame({ ...g, board, hand, guard: { ...g.guard, enlil: true } });
      setPendingUse(null);
      flash(`ENLIL thăng cấp "${UNITS[tgt.id].n}" lên lv${tgt.lv + 2}`);
      return;
    }
    if (p.eff.type === "set") {
      const tier = UNITS[tgt.id].c;
      let board = [...g.board], hand = [...g.hand];
      if (where === "board") board[index] = null; else hand = hand.filter((_, j) => j !== index);
      // +ATK cho toàn bộ NILES hiện có (sân + túi)
      board = board.map((c) => (c && UNITS[c.id].t === "NILES" ? { ...c, dA: (c.dA || 0) + tier } : c));
      hand = hand.map((it) => (it.k === "u" && UNITS[it.id].t === "NILES" ? { ...it, dA: (it.dA || 0) + tier } : it));
      setGame({ ...g, board, hand, gold: g.gold - g.guard.setCost, guard: { ...g.guard, cd: true, setUsed: true, setCost: 3, nilesBuff: g.guard.nilesBuff + tier } });
      setPendingUse(null);
      flash(`SET phá hủy "${UNITS[tgt.id].n}" (cấp ${tier}) — mọi đơn vị NILES +${tier} ATK, quân NILES mua sau cũng được cộng`);
      return;
    }
    if (p.eff.type === "anu1") {
      setAnuFrom({ where, index, tier: UNITS[tgt.id].c });
      setPendingUse(null);
      setPicker({ mode: "anu" });
      flash("Chọn đơn vị BẬC CAO HƠN để biến thành");
      return;
    }
    if (p.eff.type === "absorb") {
      const [ta, th] = effStats(ovr, tgt);
      let board = [...g.board], hand = [...g.hand];
      const src = p.abs.where === "board" ? board[p.abs.index] : hand[p.abs.index];
      const upd = { ...src, dA: (src.dA || 0) + ta, dH: (src.dH || 0) + th };
      if (p.abs.where === "board") board[p.abs.index] = upd; else hand[p.abs.index] = upd;
      if (where === "board") board[index] = null; else hand = hand.filter((_, j) => j !== index);
      setGame({ ...g, board, hand });
      setPendingUse(null);
      flash(`"${p.name}" HẤP THỤ "${UNITS[tgt.id].n}": +${ta}/+${th}`);
      return;
    }
    const a = p.eff.type === "double" ? effStats(ovr, tgt)[0] : p.finalA;
    const h = p.eff.type === "double" ? 0 : p.finalH;
    const grant = p.eff.kw || [];
    const upd = { ...tgt, dA: (tgt.dA || 0) + a, dH: (tgt.dH || 0) + h, xk: [...new Set([...(tgt.xk || []), ...grant])] };
    let board = g.board, hand = [...g.hand];
    if (where === "board") { board = [...g.board]; board[index] = upd; }
    else hand[index] = upd;
    hand = hand.filter((_, j) => j !== p.handIndex);
    const cu2 = countUse({ guard: g.guard, guardian: g.guardian, hand }, p.isDan ? "d" : "s");
    setGame({ ...g, board, hand: cu2.hand, guard: cu2.guard });
    setPendingUse(null);
    flash(`"${p.name}": +${a}/+${h}${grant.length ? " + " + grant.join(", ") : ""} cho ${UNITS[tgt.id].n}${p.eff.temp ? " (buff tạm — nhớ gỡ sau)" : ""}${cu2.msg ? " · " + cu2.msg : ""}`);
  };

  const chooseDiscover = (slot) => {
    if (!discover) return;
    const id = discover.slots[slot];
    if (id === null || id === undefined) return;
    let hand = applyHandGrow(g.hand);
    let guard = g.guard, extra = "";
    if (discover.handIndex >= 0) {
      hand = hand.filter((_, j) => j !== discover.handIndex);
      const cu = countUse({ guard: g.guard, guardian: g.guardian, hand }, "s");
      hand = cu.hand; guard = cu.guard; if (cu.msg) extra = " · " + cu.msg;
    }
    hand = [...hand, { k: "u", id, lv: 0, dA: g.guard.nilesBuff && UNITS[id].t === "NILES" ? g.guard.nilesBuff : 0, dH: 0 }];
    setGame({ ...g, hand, guard });
    setDiscover(null);
    flash(`Đã Triệu Tập "${UNITS[id].n}" vào Túi${extra}`);
  };

  /* ---- picker pick handler ---- */
  const handlePick = (kind, item) => {
    const p = picker;
    if (!p) return;
    if (p.mode === "board" && kind === "u") {
      const b = [...g.board]; b[p.slot] = { id: item.id, lv: 0, dA: 0, dH: 0 };
      setGame({ ...g, board: b }); setPicker(null);
    } else if (p.mode === "shopUnit" && kind === "u") {
      const su = [...(g.shop.units || [])]; su[p.slot] = { id: item.id };
      setGame({ ...g, shop: { ...g.shop, units: su } });
      setLogs((L) => ({ ...L, shop: [...L.shop, { temple: g.temple, unitId: item.id, ts: Date.now() }] }));
      setPicker(null);
    } else if (p.mode === "shopSpell" && kind === "s") {
      const ss = [...(g.shop.spells || [])]; ss[p.slot] = item.id;
      setGame({ ...g, shop: { ...g.shop, spells: ss } }); setPicker(null);
    } else if (p.mode === "anu" && kind === "u") {
      if (!anuFrom) { setPicker(null); return; }
      if (item.c <= anuFrom.tier) { flash(`Phải chọn đơn vị bậc CAO HƠN cấp ${anuFrom.tier}`); return; }
      const fresh = { id: item.id, lv: 0, dA: 0, dH: 0, xk: [] };
      let board = g.board, hand = [...g.hand];
      if (anuFrom.where === "board") { board = [...g.board]; board[anuFrom.index] = fresh; }
      else hand[anuFrom.index] = { k: "u", ...fresh };
      setGame({ ...g, board, hand, gold: g.gold - 2, guard: { ...g.guard, cd: true } });
      setAnuFrom(null); setPicker(null);
      flash(`ANU biến hình thành "${item.n}" (cấp ${item.c})`);
    } else if (p.mode === "discover" && kind === "u") {
      setDiscover((D) => { const slots = [...D.slots]; slots[p.slot] = item.id; return { ...D, slots }; });
      setPicker(null);
    } else if ((p.mode === "duelA" || p.mode === "duelB") && kind === "u") {
      setDuel((D) => ({ ...D, [p.mode === "duelA" ? "a" : "b"]: { id: item.id, lv: 0, xk: [] }, out: null }));
      setPicker(null);
    } else if (p.mode === "hand") {
      const it = kind === "u" ? { k: "u", id: item.id, lv: 0, dA: UNITS[item.id].t === "NILES" ? g.guard.nilesBuff : 0, dH: 0 } : { k: kind, id: item.id };
      setGame({ ...g, hand: [...applyHandGrow(g.hand), it] });
      flash(`Đã thêm "${item.n}" vào Túi`);
    }
  };

  /* ---- header ---- */
  const header = (
    <div className="px-4 pt-4 pb-3 sticky top-0 z-40" style={{ background: COL.bg, borderBottom: `1px solid ${COL.line}` }}>
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-extrabold" style={{ ...DISP, color: COL.gold }}>Mythic Tactics</div>
        <div className="text-[10px] font-bold" style={{ ...DISP, color: inSurvival ? COL.red : COL.blue }}>{inSurvival ? "Sinh tồn" : "Thử thách"}</div>
      </div>
      <div className="flex items-center gap-3.5 mt-1.5 text-xs font-bold flex-wrap" style={{ ...NUM, color: COL.mut }}>
        <span>Vòng <span style={{ color: COL.ink }}>{g.round}</span></span>
        <span style={{ color: COL.red }}>♥ {g.lives}</span>
        <span style={{ color: COL.green }}>★ {g.wins}/15</span>
        <span style={{ color: COL.gold }}>◆ {g.gold}</span>
        <span>Đền <span style={{ color: COL.ink }}>{g.temple}</span></span>
        <span>Túi <span style={{ color: COL.ink }}>{g.hand.length}</span></span>
      </div>
    </div>
  );

  /* ---- TAB TRẬN ---- */
  const tabTran = (
    <div className="p-4">
      <Card title={inSurvival ? "Vòng sinh tồn" : "Thử thách — thắng đủ 15 vòng"}>
        {inSurvival ? (
          <div>
            <div className="text-xs mb-2" style={{ color: COL.mut }}>Nhập số vòng Sinh tồn hệ thống random (3–10):</div>
            <div className="flex items-center justify-between">
              <Stepper value={g.survivalTotal ?? 3} min={3} max={10} onChange={(v) => setGame({ ...g, survivalTotal: v })} color={COL.red} />
              <div className="text-xs font-bold" style={{ color: COL.mut }}>Đã chơi <span style={{ ...NUM, color: COL.ink }}>{g.survivalPlayed}</span>/{g.survivalTotal ?? "?"}</div>
            </div>
            {g.survivalTotal && g.survivalPlayed >= g.survivalTotal && (
              <button onClick={() => endGame("win")} className="w-full mt-3 py-3 rounded-xl text-sm font-extrabold" style={{ background: COL.green + "22", color: COL.green }}>Hoàn thành ván (chiến thắng) →</button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-extrabold" style={{ ...NUM, color: COL.green }}>{g.wins}<span className="text-base" style={{ color: COL.mut }}>/15</span></div>
              <div className="text-xs" style={{ color: COL.mut }}>vòng thắng</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-extrabold" style={{ ...NUM, color: COL.red }}>{"♥".repeat(Math.max(0, g.lives))}<span style={{ color: COL.line }}>{"♥".repeat(Math.max(0, (g.guardian === "ISHTAR" ? 9 : 6) - g.lives))}</span></div>
              <div className="text-xs" style={{ color: COL.mut }}>mạng còn lại</div>
            </div>
          </div>
        )}
      </Card>

      <Card title="Kết quả vòng hiện tại">
        <div className="flex gap-2">
          <button onClick={() => endRound("W")} className="flex-1 py-3.5 rounded-xl text-sm font-extrabold" style={{ background: COL.green + "22", color: COL.green, border: `1px solid ${COL.green}44` }}>Thắng</button>
          <button onClick={() => endRound("D")} className="flex-1 py-3.5 rounded-xl text-sm font-extrabold" style={{ background: COL.blue + "22", color: COL.blue, border: `1px solid ${COL.blue}44` }}>Hòa</button>
          <button onClick={() => endRound("L")} className="flex-1 py-3.5 rounded-xl text-sm font-extrabold" style={{ background: COL.red + "22", color: COL.red, border: `1px solid ${COL.red}44` }}>Thua</button>
        </div>
        <div className="text-[11px] mt-2" style={{ color: COL.mut }}>Vòng {g.round} — Hòa: không mất mạng, không tính thắng, vòng vẫn được ghi nhận.</div>
        <div className="text-[11px] mt-2" style={{ color: COL.mut }}>Sang vòng {g.round + 1}: vàng reset về {baseGold(g.round + 1)}, giá lên đền giảm 1, Thánh Đền được làm mới (shop trong app cũng tự xóa).</div>
        {g.lives <= 0 && !inSurvival && (
          <button onClick={() => endGame("lose")} className="w-full mt-3 py-3 rounded-xl text-sm font-extrabold" style={{ background: COL.red + "22", color: COL.red }}>Hết mạng — kết thúc ván (thua)</button>
        )}
      </Card>

      <Card title="Vàng trong vòng này" right={<span className="text-[10px] font-bold" style={{ color: COL.mut }}>thu nhập vòng sau: {baseGold(g.round + 1)}</span>}>
        <div className="flex items-center justify-between">
          <Stepper value={g.gold} min={0} max={99} onChange={(v) => setGame({ ...g, gold: v })} color={COL.gold} />
          <div className="text-[11px] text-right" style={{ color: COL.mut }}>chỉnh tay khi có<br />vàng từ hiệu ứng</div>
        </div>
      </Card>

      <Card title="Thánh Đền — cấp">
        <div className="flex items-end gap-1.5 mb-3">
          {[1, 2, 3, 4, 5, 6].map((t) => (
            <div key={t} className="flex-1 rounded-t-md" style={{ height: 10 + t * 7, background: t <= g.temple ? COL.gold : COL.panel2, opacity: t <= g.temple ? 1 : 0.6, border: `1px solid ${t <= g.temple ? COL.gold : COL.line}` }} />
          ))}
        </div>
        {g.temple < 6 ? (
          <div className="flex items-center justify-between">
            <div className="text-xs" style={{ color: COL.mut }}>
              Lên cấp {g.temple + 1}: <span className="font-extrabold" style={{ ...NUM, color: COL.gold }}>{cost} vàng</span>
              <span> (gốc {UP_COST[g.temple]}, đã giảm {UP_COST[g.temple] - cost})</span>
            </div>
            <button onClick={() => { if (g.gold >= cost) { setGame({ ...g, temple: g.temple + 1, sinceUp: 0, gold: g.gold - cost }); flash("Thánh Đền lên cấp " + (g.temple + 1)); } else flash("Không đủ vàng"); }}
              className="px-4 py-2.5 rounded-xl text-sm font-extrabold" style={{ background: COL.gold + "22", color: COL.gold, border: `1px solid ${COL.gold}44` }}>Lên cấp</button>
          </div>
        ) : <div className="text-xs font-bold" style={{ color: COL.gold }}>Đã đạt cấp tối đa.</div>}
      </Card>

      <Card title="Thần Bảo Hộ">
        <div className="flex flex-wrap gap-2">
          {GUARDIANS.map((gd) => (
            <Chip key={gd.n} active={g.guardian === gd.n} color={COL.blue} onClick={() => {
              const next = g.guardian === gd.n ? null : gd.n;
              let lives = g.lives;
              if (g.guardian !== "ISHTAR" && next === "ISHTAR") lives += 3;
              if (g.guardian === "ISHTAR" && next !== "ISHTAR") lives = Math.max(0, lives - 3);
              setGame({ ...g, guardian: next, lives });
            }}>
              {gd.n}{gd.unlock ? ` (v${gd.unlock})` : ""}
            </Chip>
          ))}
        </div>
        {g.guardian && (() => {
          const gd = GUARDIANS.find((x) => x.n === g.guardian);
          const gu = g.guard;
          const btn = (label, disabled, onClick) => (
            <button onClick={onClick} disabled={disabled} className="w-full mt-2 py-2.5 rounded-xl text-xs font-extrabold"
              style={{ background: disabled ? COL.panel : COL.blue + "22", color: disabled ? COL.mut : COL.blue, border: `1px solid ${disabled ? COL.line : COL.blue + "44"}`, opacity: disabled ? 0.7 : 1 }}>{label}</button>
          );
          return (
            <div className="text-[11px] mt-3 rounded-xl p-3 leading-relaxed" style={{ background: COL.panel2, color: COL.ink }}>
              <b style={{ color: COL.blue }}>{gd.skill}</b> ({gd.cost}) — {gd.desc}
              {g.guardian === "HORUS" && btn(gu.cd ? "Đã dùng lượt này (CD)" : `Dùng Mắt thần (4 vàng) → Triệu Tập cấp ≤ ${Math.min(g.temple + 1, 6)}`, gu.cd || g.gold < 4,
                () => { setGame({ ...g, gold: g.gold - 4, guard: { ...gu, cd: true } }); setDiscover({ handIndex: -1, name: `Mắt thần Horus — cấp ≤ ${Math.min(g.temple + 1, 6)}`, slots: [null, null, null] }); setTab("doihinh"); flash("Mục 🔮 Triệu Tập đã kích hoạt — điền 3 lựa chọn"); })}
              {g.guardian === "ENLIL" && btn(gu.enlil ? "Đã dùng (1 lần / ván)" : "Dùng Quyền năng tối cao: thăng cấp 1 đồng minh", gu.enlil,
                () => setPendingUse({ eff: { type: "enlil" }, name: "Quyền năng tối cao — chọn đồng minh thăng cấp" }))}
              {g.guardian === "ZEUS" && (
                <>
                  <div className="mt-2 font-bold" style={{ color: COL.gold }}>⚡ Sát thương hiện tại: {3 + 3 * gu.spells} <span style={{ color: COL.mut, fontWeight: 400 }}>(3 + 3 × {gu.spells} phép đã dùng — app tự đếm)</span></div>
                  {btn(gu.cd ? "Đã kích lượt này (CD)" : `Kích Tia chớp (1 vàng)`, gu.cd || g.gold < 1,
                    () => { setGame({ ...g, gold: g.gold - 1, guard: { ...gu, cd: true } }); flash(`⚡ KHAI TRẬN trận tới: ${3 + 3 * gu.spells} sát thương lên kẻ địch nhiều máu nhất`); })}
                </>
              )}
              {g.guardian === "NHỊ LANG THẦN" && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold" style={{ color: COL.gold }}>Tiên Đan đã dùng: {gu.dan}/20 (app tự đếm)</span>
                  <div className="flex gap-1">
                    <button onClick={() => setGame({ ...g, guard: { ...gu, dan: Math.max(0, gu.dan - 1) } })} className="w-7 h-7 rounded-lg font-bold" style={{ background: COL.panel, color: COL.mut }}>−</button>
                    <button onClick={() => setGame({ ...g, guard: { ...gu, dan: gu.dan + 1 } })} className="w-7 h-7 rounded-lg font-bold" style={{ background: COL.panel, color: COL.mut }}>+</button>
                  </div>
                </div>
              )}
              {g.guardian === "SET" && btn(gu.cd ? "Đã dùng lượt này (CD)" : `Dùng Cắt xén (${gu.setCost} vàng): phá hủy 1 NILES → buff cả tộc`, gu.cd || g.gold < gu.setCost,
                () => setPendingUse({ eff: { type: "set" }, tribe: "NILES", name: "Cắt xén — chọn đồng minh NILES phá hủy" }))}
              {g.guardian === "ANU" && btn(gu.cd ? "Đã dùng lượt này (CD)" : "Dùng Thăng hoa (2 vàng): chọn đơn vị để biến hình", gu.cd || g.gold < 2,
                () => setPendingUse({ eff: { type: "anu1" }, name: "Thăng hoa — chọn đơn vị bậc thấp cần biến" }))}
              {g.guardian === "NERGAL" && btn(gu.cd ? "Đã dùng lượt này (CD)" : "Dùng Xiềng xích (1 vàng): khóa 1 đơn vị trong đền +2/+2", gu.cd || g.gold < 1 || !shopUnits.some(Boolean),
                () => setNergal(true))}
            </div>
          );
        })()}
      </Card>

      <button onClick={() => { if (confirm("Kết thúc và lưu ván hiện tại?")) endGame(g.wins >= 15 ? "win" : "abandon"); }}
        className="w-full py-3 rounded-xl text-xs font-bold mb-6" style={{ background: COL.panel, color: COL.mut, border: `1px solid ${COL.line}` }}>
        Kết thúc ván & lưu vào lịch sử
      </button>
    </div>
  );

  /* ---- TAB ĐỘI HÌNH ---- */

  const buyShopUnit = (i) => {
    const s = shopUnits[i]; if (!s) return;
    if (g.gold < 3) { flash("Không đủ 3 vàng"); return; }
    const su = [...shopUnits]; su[i] = null;
    setGame({ ...g, gold: g.gold - 3, shop: { ...g.shop, units: su }, hand: [...applyHandGrow(g.hand), { k: "u", id: s.id, lv: 0, dA: g.shopBuff.a + (UNITS[s.id].t === "NILES" ? g.guard.nilesBuff : 0), dH: g.shopBuff.h }] });
    flash(`Đã mua "${UNITS[s.id].n}"${g.shopBuff.a || g.shopBuff.h ? ` (kèm buff đền +${g.shopBuff.a}/+${g.shopBuff.h})` : ""} → vào Túi (−3 vàng)`);
  };
  const buyShopSpell = (i) => {
    const sid = shopSpells[i]; if (sid === null) return;
    const price = spellPrice(ovr, sid);
    if (g.gold < price) { flash(`Không đủ ${price} vàng`); return; }
    const ss = [...shopSpells]; ss[i] = null;
    setGame({ ...g, gold: g.gold - price, shop: { ...g.shop, spells: ss }, hand: [...applyHandGrow(g.hand), { k: "s", id: sid }] });
    flash(`Đã mua phép "${SPELLS[sid].n}" (−${price} vàng)`);
  };

  const tabDoihinh = (
    <div className="p-4">
      <Card title="3 tộc của ván này (Neutral luôn có)">
        <div className="flex flex-wrap gap-2">
          {Object.keys(TRIBE_META).filter((t) => t !== "NEUTRAL").map((t) => (
            <Chip key={t} active={g.tribes.includes(t)} color={TRIBE_META[t].c}
              onClick={() => {
                const has = g.tribes.includes(t);
                if (has) setGame({ ...g, tribes: g.tribes.filter((x) => x !== t) });
                else if (g.tribes.length < 3) setGame({ ...g, tribes: [...g.tribes, t] });
                else flash("Chỉ chọn 3 tộc");
              }}>{TRIBE_META[t].l}</Chip>
          ))}
        </div>
      </Card>

      <Card title={`Thánh Đền cấp ${g.temple} — ${unitSlots} quân + ${spellSlots} phép${hasScholar ? " (Học Giả Hy Lạp +1)" : ""}`}
        right={<div className="flex gap-1.5">
          <button onClick={() => { setGame({ ...g, frozen: !g.frozen }); flash(g.frozen ? "Đã bỏ đóng băng" : "❄ Đã đóng băng — hàng còn lại giữ sang vòng sau"); }}
            className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg" style={{ background: g.frozen ? COL.blue + "44" : COL.panel2, color: g.frozen ? "#9ED7FF" : COL.mut, border: `1px solid ${g.frozen ? COL.blue : COL.line}` }}>❄ {g.frozen ? "Đang băng" : "Đóng băng"}</button>
          <button onClick={() => { if (g.gold < 1) { flash("Không đủ 1 vàng"); return; } setGame({ ...g, gold: g.gold - 1, frozen: false, shop: { units: [], spells: [] } }); flash("Đã đổi lại (−1 vàng) — nhập shop mới"); }}
            className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg" style={{ background: COL.blue + "22", color: COL.blue }}>Đổi lại −1v</button>
        </div>}>
        <div className="text-[11px] mb-2" style={{ color: COL.mut }}>Nhập những gì shop đang bán, rồi bấm Mua hoặc sang tab Tối ưu để được tư vấn.</div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {shopUnits.map((s, i) => {
            const u = s ? UNITS[s.id] : null;
            return (
              <div key={i} className="rounded-xl p-2" style={{ minHeight: 76, background: u ? COL.panel2 : "transparent", border: u ? `1px solid ${TRIBE_META[u.t].c}55` : `1px dashed ${COL.line}` }}>
                {u ? (
                  <>
                    <div className="text-[10px] font-bold leading-tight break-words" style={{ color: COL.ink }}>{u.n}</div>
                    <div className="text-[9px] font-extrabold" style={{ ...NUM, color: TRIBE_META[u.t].c }}>C{u.c} · {baseStats(ovr, u.id)[0][0] + g.shopBuff.a}/{baseStats(ovr, u.id)[0][1] + g.shopBuff.h}{(g.shopBuff.a || g.shopBuff.h) ? <span style={{ color: COL.gold }}> ✦</span> : null}</div>
                    <div className="flex gap-1 mt-1">
                      <button onClick={() => buyShopUnit(i)} className="flex-1 text-[9px] font-extrabold py-1 rounded" style={{ background: COL.gold + "22", color: COL.gold }}>Mua 3v</button>
                      <button onClick={() => { const su = [...shopUnits]; su[i] = null; setGame({ ...g, shop: { ...g.shop, units: su } }); }} className="text-[9px] font-bold px-1.5 rounded" style={{ background: COL.panel, color: COL.mut }}>✕</button>
                    </div>
                  </>
                ) : (
                  <button onClick={() => setPicker({ mode: "shopUnit", slot: i })} className="w-full h-full text-xl" style={{ color: COL.line, minHeight: 56 }}>+</button>
                )}
              </div>
            );
          })}
        </div>
        <div className="rounded-xl p-2 mb-2 flex items-center justify-between" style={{ background: COL.panel2 }}>
          <div className="text-[9px] font-bold leading-tight" style={{ color: COL.mut }}>Buff quân trong đền<br />(Horagi / Nhập Tiệc...)</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1"><span className="text-[9px] font-bold" style={{ color: COL.red }}>+A</span>
              <Stepper small value={g.shopBuff.a} min={0} color={COL.red} onChange={(v) => setGame({ ...g, shopBuff: { ...g.shopBuff, a: v } })} /></div>
            <div className="flex items-center gap-1"><span className="text-[9px] font-bold" style={{ color: COL.green }}>+H</span>
              <Stepper small value={g.shopBuff.h} min={0} color={COL.green} onChange={(v) => setGame({ ...g, shopBuff: { ...g.shopBuff, h: v } })} /></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {shopSpells.map((sid, i) => {
            const sp = sid !== null ? SPELLS[sid] : null;
            return (
              <div key={i} className="rounded-xl p-2" style={{ minHeight: 60, background: sp ? COL.panel2 : "transparent", border: sp ? `1px solid ${COL.purple}55` : `1px dashed ${COL.line}` }}>
                {sp ? (
                  <>
                    <div className="text-[10px] font-bold leading-tight break-words" style={{ color: COL.purple }}>{sp.n}</div>
                    <div className="flex gap-1 mt-1.5">
                      <button onClick={() => buyShopSpell(i)} className="flex-1 text-[9px] font-extrabold py-1 rounded" style={{ background: COL.purple + "22", color: COL.purple }}>Mua {spellPrice(ovr, sid)}v</button>
                      <button onClick={() => { const ss = [...shopSpells]; ss[i] = null; setGame({ ...g, shop: { ...g.shop, spells: ss } }); }} className="text-[9px] font-bold px-1.5 rounded" style={{ background: COL.panel, color: COL.mut }}>✕</button>
                    </div>
                  </>
                ) : (
                  <button onClick={() => setPicker({ mode: "shopSpell", slot: i })} className="w-full h-full text-xl" style={{ color: COL.line, minHeight: 44 }}>+ phép</button>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <Card title={discover ? `🔮 Triệu Tập — ${discover.name}` : "🔮 Triệu Tập"}
        right={discover
          ? <button onClick={() => setDiscover(null)} className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg" style={{ background: COL.red + "22", color: COL.red }}>Hủy</button>
          : <button onClick={() => setDiscover({ handIndex: -1, name: "kích hoạt thủ công", slots: [null, null, null] })}
              className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg" style={{ background: COL.panel2, color: COL.mut, border: `1px solid ${COL.line}` }}>Kích hoạt</button>}>
        <div style={{ opacity: discover ? 1 : 0.45 }}>
          {!discover && <div className="text-[11px] mb-2" style={{ color: COL.mut }}>Tự kích hoạt khi Dùng phép có "TRIỆU TẬP" hoặc Mắt thần Horus; bấm "Kích hoạt" cho hiệu ứng tướng/thần khác. Chưa kích hoạt thì không dùng được.</div>}
          {discover && <div className="text-[11px] mb-2" style={{ color: COL.mut }}>Điền 3 đơn vị game đưa ra — app chấm điểm, bấm ✓ để nhận lá đó vào Túi.</div>}
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => {
              const id = discover ? discover.slots[i] : null;
              const u = id !== null && id !== undefined ? UNITS[id] : null;
              const ev = u ? evalDiscover(g, ovr, id) : null;
              return (
                <div key={i} className="rounded-xl p-2" style={{ minHeight: 84, background: u ? COL.panel2 : "transparent", border: u ? `1px solid ${TRIBE_META[u.t].c}55` : `1px dashed ${COL.line}`, borderTop: u ? `3px solid ${TRIBE_META[u.t].c}` : `1px dashed ${COL.line}` }}>
                  {u ? (
                    <>
                      <button onClick={() => setPicker({ mode: "discover", slot: i })} className="w-full text-left">
                        <div className="text-[10px] font-bold leading-tight break-words" style={{ color: COL.ink }}>{u.n}</div>
                        <div className="text-[9px] font-extrabold" style={{ ...NUM, color: TRIBE_META[u.t].c }}>C{u.c} · {baseStats(ovr, id)[0][0]}/{baseStats(ovr, id)[0][1]} <span style={{ color: COL.gold }}>+{ev.delta}đ</span></div>
                      </button>
                      <button onClick={() => chooseDiscover(i)} className="w-full mt-1 text-[9px] font-extrabold py-1 rounded" style={{ background: COL.gold + "22", color: COL.gold }}>✓ Chọn</button>
                    </>
                  ) : (
                    <button onClick={() => { if (discover) setPicker({ mode: "discover", slot: i }); else flash("Triệu Tập chưa được kích hoạt — dùng phép Triệu Tập hoặc bấm Kích hoạt"); }}
                      className="w-full h-full text-xl" style={{ color: COL.line, minHeight: 64 }}>+</button>
                  )}
                </div>
              );
            })}
          </div>
          {discover && (() => {
            const filled = discover.slots.map((id, i) => (id !== null && id !== undefined ? { id, i, ev: evalDiscover(g, ovr, id) } : null)).filter(Boolean);
            if (filled.length < 2) return null;
            const best = filled.reduce((a, b) => (b.ev.delta > a.ev.delta ? b : a));
            return <div className="text-[11px] mt-2" style={{ color: COL.gold }}>★ Nên chọn "{UNITS[best.id].n}" (+{best.ev.delta} điểm{best.ev.reasons.length ? ": " + best.ev.reasons.join(", ") : ""}).</div>;
          })()}
        </div>
      </Card>

      <Card title="Sân đấu 2×3"
        right={<div className="flex items-center gap-2">
          <span className="text-[10px] font-bold" style={{ ...NUM, color: COL.gold }}>điểm {sc.total}</span>
          <button onClick={() => { setGame({ ...g, board: autoArrange(g.board, ovr) }); setTab("toiuu"); flash("Đã xếp lại vị trí tối ưu"); }}
            className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg" style={{ background: COL.gold + "22", color: COL.gold }}>⚡ Tối ưu</button>
        </div>}>
        {moveFrom !== null && <div className="text-[11px] mb-2 font-bold" style={{ color: COL.blue }}>Chọn ô muốn chuyển "{UNITS[g.board[moveFrom].id].n}" đến (chạm ô bất kỳ)…</div>}
        {[["HÀNG TRƯỚC", 0], ["HÀNG SAU", 3]].map(([label, off]) => (
          <div key={label} className="mb-2">
            <div className="text-[9px] font-bold mb-1" style={{ ...DISP, color: COL.mut }}>{label}</div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => {
                const idx = off + i;
                const cell = g.board[idx];
                const u = cell ? UNITS[cell.id] : null;
                const st = cell ? effStats(ovr, cell) : null;
                return (
                  <button key={idx}
                    onClick={() => {
                      if (moveFrom !== null) {
                        const b = [...g.board]; const tmp = b[idx]; b[idx] = b[moveFrom]; b[moveFrom] = tmp;
                        setGame({ ...g, board: b }); setMoveFrom(null); return;
                      }
                      cell ? setSheet({ where: "board", index: idx }) : setPicker({ mode: "board", slot: idx });
                    }}
                    className="rounded-xl p-2 text-left"
                    style={{
                      minHeight: 74, background: u ? COL.panel2 : "transparent",
                      border: moveFrom === idx ? `2px solid ${COL.blue}` : u ? `1px solid ${TRIBE_META[u.t].c}55` : `1px dashed ${COL.line}`,
                      borderTop: moveFrom === idx ? `2px solid ${COL.blue}` : u ? `3px solid ${TRIBE_META[u.t].c}` : `1px dashed ${COL.line}`,
                    }}>
                    {u ? (
                      <>
                        <div className="text-[11px] font-bold leading-tight break-words" style={{ color: COL.ink }}>{u.n}</div>
                        <div className="text-[10px] font-extrabold mt-1" style={{ ...NUM, color: TRIBE_META[u.t].c }}>
                          {st[0]}/{st[1]} <span style={{ color: COL.mut }}>· lv{cell.lv + 1}</span>{(cell.dA || cell.dH) ? <span style={{ color: COL.gold }}> ✦</span> : null}
                        </div>
                      </>
                    ) : <div className="text-xl text-center mt-3" style={{ color: COL.line }}>+</div>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </Card>

      {(g.tribes.includes("SHENZHOU") || g.hand.some((it) => it.k === "d")) && (
        <Card title="Chỉ số cộng thêm Tiên Đan" right={<span className="text-[9px] font-bold" style={{ color: COL.mut }}>Hỗn Độn / Thỏ Ngọc / Khổng Minh</span>}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold" style={{ color: COL.red }}>+ATK</span>
              <Stepper small value={g.danBonus.a} min={0} color={COL.red} onChange={(v) => setGame({ ...g, danBonus: { ...g.danBonus, a: v } })} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold" style={{ color: COL.green }}>+MÁU</span>
              <Stepper small value={g.danBonus.h} min={0} color={COL.green} onChange={(v) => setGame({ ...g, danBonus: { ...g.danBonus, h: v } })} />
            </div>
          </div>
          <div className="text-[10px] mt-2" style={{ color: COL.mut }}>Tự cộng vào mỗi Tiên Đan tăng chỉ số khi bấm Dùng (VD: cộng thêm 5/5 → Bội Lực Đan cho +6 ATK).</div>
        </Card>
      )}

      <Card title={`Túi (${g.hand.length})`}
        right={<button onClick={() => setPicker({ mode: "hand" })} className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg" style={{ background: COL.green + "22", color: COL.green }}>+ Thêm</button>}>
        {g.hand.length ? g.hand.map((it, i) => {
          if (it.k === "u") {
            const u = UNITS[it.id]; const st = effStats(ovr, it);
            return (
              <button key={i} onClick={() => setSheet({ where: "hand", index: i })} className="w-full text-left rounded-xl p-2.5 mb-1.5 flex items-center gap-2.5"
                style={{ background: COL.panel2, border: `1px solid ${COL.line}`, borderLeft: `3px solid ${TRIBE_META[u.t].c}` }}>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold" style={{ color: COL.ink }}>{u.n}</span>
                  <span className="text-[10px] ml-2 font-extrabold" style={{ ...NUM, color: TRIBE_META[u.t].c }}>{st[0]}/{st[1]} lv{it.lv + 1}{(it.dA || it.dH) ? " ✦" : ""}{it.lock ? ` 🔒${it.lock}` : ""}</span>
                </div>
                <span className="text-[9px]" style={{ color: COL.mut }}>quân</span>
              </button>
            );
          }
          const src = it.k === "s" ? SPELLS[it.id] : DANS[it.id];
          const color = it.k === "s" ? COL.purple : COL.gold;
          return (
            <div key={i} className="rounded-xl p-2.5 mb-1.5" style={{ background: COL.panel2, border: `1px solid ${COL.line}`, borderLeft: `3px solid ${color}` }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color }}>{src.n}</span>
                <div className="flex gap-1.5">
                  <button onClick={() => playCard(i)}
                    className="text-[9px] font-extrabold px-2 py-1 rounded" style={{ background: color + "22", color }}>Dùng</button>
                  <button onClick={() => setGame({ ...g, hand: g.hand.filter((_, j) => j !== i) })} className="text-[9px] font-bold px-2 py-1 rounded" style={{ background: COL.panel, color: COL.mut }}>✕</button>
                </div>
              </div>
              <div className="text-[10px] mt-1 leading-snug" style={{ color: COL.mut }}>{src.d}</div>
            </div>
          );
        }) : <div className="text-xs" style={{ color: COL.mut }}>Túi trống — mua từ Thánh Đền hoặc bấm "+ Thêm" khi hiệu ứng cho thẻ. Phép và tiên đan chỉ dùng được, không bán được.</div>}
      </Card>

      {sc.count > 0 && (
        <Card title="Tổng quan đội hình">
          {(() => {
            const bus = g.board.filter(Boolean);
            const atk = bus.reduce((a, c) => a + effStats(ovr, c)[0], 0);
            const hp = bus.reduce((a, c) => a + effStats(ovr, c)[1], 0);
            const tags = {};
            bus.forEach((c) => UNITS[c.id].tags.forEach((t) => (tags[t] = (tags[t] || 0) + 1)));
            return (
              <>
                <div className="flex gap-4 mb-3 text-sm font-extrabold" style={NUM}>
                  <span style={{ color: COL.red }}>{atk} ATK</span>
                  <span style={{ color: COL.green }}>{hp} MÁU</span>
                  <span style={{ color: COL.mut }}>{sc.count}/6 quân</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(tags).sort((a, b) => b[1] - a[1]).map(([t, n]) => (
                    <span key={t} className="text-[10px] font-bold px-2 py-1 rounded" style={{ background: n >= 2 ? COL.gold + "22" : COL.panel2, color: n >= 2 ? COL.gold : COL.mut }}>{TAG_LABEL[t]} ×{n}</span>
                  ))}
                </div>
              </>
            );
          })()}
        </Card>
      )}
    </div>
  );

  /* ---- TAB TỐI ƯU ---- */
  const warns = positionWarnings(g.board, ovr);
  const tabToiuu = (
    <div className="p-4">
      <Card title="Kế hoạch hành động (theo thứ tự ưu tiên)">
        {plan.actions.length ? plan.actions.map((a, i) => (
          <div key={i} className="flex items-start gap-2.5 py-2 text-xs leading-relaxed" style={{ borderBottom: i < plan.actions.length - 1 ? `1px solid ${COL.line}` : "none", color: COL.ink }}>
            <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5" style={{ ...NUM, background: COL.gold + "22", color: COL.gold }}>{i + 1}</span>
            <span>{a.txt}</span>
          </div>
        )) : <div className="text-xs" style={{ color: COL.mut }}>Nhập shop Thánh Đền và xếp quân ở tab Đội hình — kế hoạch sẽ hiện ở đây với hành động cụ thể (mua gì, bán gì, dùng phép nào).</div>}
        {plan.notes.map((n, i) => (
          <div key={i} className="text-[11px] mt-2 leading-relaxed" style={{ color: COL.mut }}>ℹ {n}</div>
        ))}
      </Card>

      {warns.length > 0 && (
        <Card title="Vị trí cần chỉnh" right={<button onClick={() => { setGame({ ...g, board: autoArrange(g.board, ovr) }); flash("Đã xếp lại"); }} className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg" style={{ background: COL.gold + "22", color: COL.gold }}>⚡ Tự xếp</button>}>
          {warns.map((w, i) => (
            <div key={i} className="text-xs py-1.5 leading-relaxed" style={{ color: COL.ink, borderBottom: i < warns.length - 1 ? `1px solid ${COL.line}` : "none" }}>
              <span style={{ color: COL.red }}>▸</span> {w}
            </div>
          ))}
        </Card>
      )}

      <Card title="Điểm đội hình" right={<span className="text-lg font-extrabold" style={{ ...NUM, color: COL.gold }}>{sc.total}</span>}>
        {sc.items.length ? sc.items.map((it, i) => (
          <div key={i} className="flex justify-between text-xs py-1.5" style={{ borderBottom: i < sc.items.length - 1 ? `1px solid ${COL.line}` : "none" }}>
            <span style={{ color: COL.ink }}>{it.label}</span>
            <span className="font-extrabold" style={{ ...NUM, color: it.pts > 0 ? COL.green : COL.mut }}>+{it.pts}</span>
          </div>
        )) : <div className="text-xs" style={{ color: COL.mut }}>Xếp quân vào sân trước.</div>}
      </Card>

      <Card title="Mô phỏng đấu 1v1">
        <div className="grid grid-cols-2 gap-2 mb-2">
          {[["a", "Quân của bạn", "duelA"], ["b", "Quân địch", "duelB"]].map(([side, label, mode]) => {
            const sel = duel[side];
            return (
              <div key={side}>
                <div className="text-[9px] font-bold mb-1" style={{ ...DISP, color: COL.mut }}>{label}</div>
                <button onClick={() => setPicker({ mode })} className="w-full rounded-xl p-2.5 text-left"
                  style={{ background: COL.panel2, border: `1px solid ${sel ? TRIBE_META[UNITS[sel.id].t].c + "66" : COL.line}` }}>
                  {sel ? (
                    <>
                      <div className="text-[11px] font-bold break-words" style={{ color: COL.ink }}>{UNITS[sel.id].n}</div>
                      <div className="text-[10px] font-extrabold" style={{ ...NUM, color: COL.mut }}>{baseStats(ovr, sel.id)[sel.lv][0]}/{baseStats(ovr, sel.id)[sel.lv][1]}</div>
                    </>
                  ) : <div className="text-xs text-center py-1" style={{ color: COL.mut }}>+ chọn quân</div>}
                </button>
                {sel && (
                  <div className="flex gap-1 mt-1">
                    {[0, 1, 2].map((lv) => (
                      <button key={lv} onClick={() => setDuel({ ...duel, [side]: { ...sel, lv }, out: null })}
                        className="flex-1 py-1 rounded-lg text-[9px] font-extrabold"
                        style={{ background: sel.lv === lv ? COL.gold + "22" : COL.panel2, color: sel.lv === lv ? COL.gold : COL.mut, border: `1px solid ${sel.lv === lv ? COL.gold : COL.line}` }}>lv{lv + 1}</button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mb-2">
          <button onClick={() => setDuel({ ...duel, first: duel.first === "a" ? "b" : "a", out: null })}
            className="flex-1 py-2 rounded-xl text-[10px] font-bold" style={{ background: COL.panel2, color: COL.ink, border: `1px solid ${COL.line}` }}>
            Đánh trước: {duel.first === "a" ? "quân của bạn" : "quân địch"} (chạm để đổi)
          </button>
          <button onClick={() => { if (duel.a && duel.b) setDuel({ ...duel, out: simDuel(duel.a, duel.b, duel.first === "a", ovr) }); else flash("Chọn đủ 2 quân trước"); }}
            className="px-5 py-2 rounded-xl text-xs font-extrabold" style={{ background: COL.red + "22", color: COL.red, border: `1px solid ${COL.red}44` }}>⚔ Đấu</button>
        </div>
        {duel.out && (
          <div className="rounded-xl p-3" style={{ background: COL.panel2 }}>
            <div className="text-xs font-extrabold mb-2" style={{ color: COL.gold }}>{duel.out.res}</div>
            <div className="text-[10px] leading-relaxed" style={{ ...NUM, color: COL.mut, whiteSpace: "pre-wrap" }}>{duel.out.log.join("\n")}</div>
          </div>
        )}
        <div className="text-[10px] mt-2 leading-snug" style={{ color: COL.mut }}>
          Mô phỏng đòn đánh qua lại 1v1: đã tính phản công, Lá Chắn, Tầm Xa, Hiểm Độc, Khiêu Khích/Ẩn Thân và các hiệu ứng tự cường hóa parse được từ kỹ năng (60/182 tướng). Hiệu ứng phức tạp (triệu hồi, đốt lan, hồi sinh...) chưa mô phỏng — kết quả chỉ mang tính tham khảo.
        </div>
      </Card>
    </div>
  );

  /* ---- TAB DANH SÁCH ---- */
  const tabDanhsach = (
    <div className="p-4">
      <div className="flex gap-2 mb-3">
        {[["u", "Quân"], ["s", "Phép"], ["d", "Tiên Đan"]].map(([k, l]) => (
          <Chip key={k} active={listKind === k} color={COL.gold} onClick={() => setListKind(k)}>{l}</Chip>
        ))}
      </div>

      {listKind === "u" && Object.keys(TRIBE_META).map((t) => {
        const us = UNITS.filter((u) => u.t === t).sort((a, b) => a.c - b.c || a.n.localeCompare(b.n));
        const open = openTribe === t;
        return (
          <div key={t} className="mb-2">
            <button onClick={() => setOpenTribe(open ? null : t)} className="w-full flex items-center justify-between rounded-xl px-3 py-3"
              style={{ background: COL.panel, border: `1px solid ${COL.line}`, borderLeft: `3px solid ${TRIBE_META[t].c}` }}>
              <span className="text-sm font-extrabold" style={{ color: TRIBE_META[t].c, ...DISP }}>{TRIBE_META[t].l}</span>
              <span className="text-[10px] font-bold" style={{ ...NUM, color: COL.mut }}>{us.length} thẻ {open ? "▾" : "▸"}</span>
            </button>
            {open && us.map((u) => {
              const bs = baseStats(ovr, u.id);
              const changed = !!ovr.stats[u.id];
              return (
                <button key={u.id} onClick={() => setEditUnit(u.id)} className="w-full text-left rounded-xl p-2.5 mt-1.5 flex items-center gap-2.5"
                  style={{ background: COL.panel2, border: `1px solid ${COL.line}` }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0" style={{ background: TRIBE_META[t].c + "26", color: TRIBE_META[t].c, ...NUM }}>{u.c || "TH"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate" style={{ color: COL.ink }}>{u.n}{u.sum ? " ⟡" : ""}{changed ? <span style={{ color: COL.gold }}> ✎</span> : null}</div>
                    <div className="text-[10px]" style={{ ...NUM, color: COL.mut }}>{bs[0][0]}/{bs[0][1]} → {bs[1][0]}/{bs[1][1]} → {bs[2][0]}/{bs[2][1]}</div>
                  </div>
                </button>
              );
            })}
          </div>
        );
      })}

      {listKind === "s" && [6, 5, 4, 3, 2, 1].map((tier) => {
        const sps = SPELLS.filter((s) => s.c === tier);
        if (!sps.length) return null;
        return (
          <div key={tier} className="mb-3">
            <div className="text-[10px] font-extrabold mb-1.5" style={{ ...DISP, color: COL.purple }}>Phép cấp {tier}</div>
            {sps.map((sp) => (
              <div key={sp.id} className="rounded-xl p-2.5 mb-1.5" style={{ background: COL.panel, border: `1px solid ${COL.line}`, borderLeft: `3px solid ${COL.purple}` }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold" style={{ color: COL.ink }}>{sp.n}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[9px]" style={{ color: COL.mut }}>giá</span>
                    <input type="number" inputMode="numeric" value={spellPrice(ovr, sp.id)}
                      onChange={(e) => setOvr({ ...ovr, prices: { ...ovr.prices, [sp.id]: Math.max(0, parseInt(e.target.value || "0", 10)) } })}
                      className="w-12 text-center rounded-lg py-1 text-xs font-extrabold outline-none"
                      style={{ ...NUM, background: COL.panel2, color: COL.gold, border: `1px solid ${sp.p === 0 && !ovr.prices[sp.id] ? COL.red + "66" : COL.line}` }} />
                    <span className="text-[9px]" style={{ color: COL.mut }}>v</span>
                  </div>
                </div>
                <div className="text-[11px] mt-1 leading-snug" style={{ color: COL.mut }}>{sp.d}</div>
              </div>
            ))}
          </div>
        );
      })}

      {listKind === "d" && [6, 5, 4, 3, 2, 1].map((tier) => {
        const ds = DANS.filter((s) => s.c === tier);
        if (!ds.length) return null;
        return (
          <div key={tier} className="mb-3">
            <div className="text-[10px] font-extrabold mb-1.5" style={{ ...DISP, color: COL.gold }}>Tiên Đan cấp {tier} — không có giá</div>
            {ds.map((d) => (
              <div key={d.id} className="rounded-xl p-2.5 mb-1.5" style={{ background: COL.panel, border: `1px solid ${COL.line}`, borderLeft: `3px solid ${COL.gold}` }}>
                <div className="text-xs font-bold" style={{ color: COL.ink }}>{d.n}</div>
                <div className="text-[11px] mt-1 leading-snug" style={{ color: COL.mut }}>{d.d}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  /* ---- TAB DỮ LIỆU ---- */
  const shopByTemple = useMemo(() => {
    const m = {};
    logs.shop.forEach((r) => {
      m[r.temple] = m[r.temple] || { total: 0, tiers: {} };
      const u = UNITS[r.unitId];
      m[r.temple].total += 1;
      m[r.temple].tiers[u.c] = (m[r.temple].tiers[u.c] || 0) + 1;
    });
    return m;
  }, [logs.shop]);

  const tabDulieu = (
    <div className="p-4">
      <Card title="Ghi nhận shop" right={<span className="text-[10px] font-bold" style={{ ...NUM, color: COL.mut }}>{logs.shop.length} bản ghi</span>}>
        <div className="text-[11px]" style={{ color: COL.mut }}>
          Mỗi đơn vị bạn nhập vào Thánh Đền (tab Đội hình) được tự động ghi lại theo cấp đền để kiểm chứng tỉ lệ — không cần nhập 2 lần.
        </div>
      </Card>

      {Object.keys(shopByTemple).length > 0 && (
        <Card title="Tần suất theo cấp đền — quan sát vs kỳ vọng đồng đều">
          {Object.entries(shopByTemple).sort((a, b) => a[0] - b[0]).map(([tp, d]) => {
            const tpn = Number(tp);
            const avail = UNITS.filter((u) => !u.sum && u.c >= 1 && u.c <= tpn);
            return (
              <div key={tp} className="mb-3">
                <div className="text-[10px] font-bold mb-1" style={{ ...DISP, color: COL.gold }}>Đền cấp {tp} · {d.total} lượt thấy</div>
                {Array.from({ length: tpn }, (_, i) => i + 1).map((tier) => {
                  const obs = d.tiers[tier] || 0;
                  const obsP = d.total ? Math.round((100 * obs) / d.total) : 0;
                  const expP = Math.round((100 * avail.filter((u) => u.c === tier).length) / avail.length);
                  return (
                    <div key={tier} className="flex items-center gap-2 text-[11px] py-0.5" style={NUM}>
                      <span className="w-10" style={{ color: COL.mut }}>Cấp {tier}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: COL.panel2 }}>
                        <div className="h-full" style={{ width: obsP + "%", background: COL.blue }} />
                      </div>
                      <span className="w-24 text-right" style={{ color: COL.ink }}>{obs} ({obsP}% / kv {expP}%)</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </Card>
      )}

      <Card title="Lịch sử vòng" right={<span className="text-[10px] font-bold" style={{ ...NUM, color: COL.mut }}>{logs.rounds.length}</span>}>
        {logs.rounds.length ? (
          <div className="flex flex-wrap gap-1.5">
            {logs.rounds.slice(-40).map((r, i) => (
              <span key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-extrabold"
                style={{ ...NUM, background: r.result === "W" ? COL.green + "22" : r.result === "D" ? COL.blue + "22" : COL.red + "22", color: r.result === "W" ? COL.green : r.result === "D" ? COL.blue : COL.red }}>{r.round}</span>
            ))}
          </div>
        ) : <div className="text-xs" style={{ color: COL.mut }}>Chưa có — kết quả vòng ghi tự động từ tab Trận.</div>}
      </Card>

      <Card title="Lịch sử ván" right={<span className="text-[10px] font-bold" style={{ ...NUM, color: COL.mut }}>{logs.games.length}</span>}>
        {logs.games.length ? logs.games.slice(-10).reverse().map((gm, i) => (
          <div key={i} className="text-[11px] py-2 leading-relaxed" style={{ borderBottom: `1px solid ${COL.line}`, color: COL.ink }}>
            <b style={{ color: gm.result === "win" ? COL.green : COL.red }}>{gm.result === "win" ? "THẮNG" : gm.result === "lose" ? "THUA" : "BỎ DỞ"}</b>
            {" "}· đến vòng {gm.reachedRound} · {gm.wins} thắng · tộc: {(gm.tribes || []).map((t) => TRIBE_META[t]?.l).join(", ") || "?"}{gm.guardian ? " · " + gm.guardian : ""}
            {gm.board?.length ? <div style={{ color: COL.mut }}>đội: {gm.board.map((b) => `${b.n}(lv${b.lv})`).join(", ")}</div> : null}
          </div>
        )) : <div className="text-xs" style={{ color: COL.mut }}>Chưa có ván nào được lưu.</div>}
      </Card>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setShowExport(!showExport)} className="flex-1 py-3 rounded-xl text-xs font-bold" style={{ background: COL.panel, color: COL.ink, border: `1px solid ${COL.line}` }}>
          {showExport ? "Ẩn JSON" : "Xuất dữ liệu (JSON)"}
        </button>
        <button onClick={() => { if (confirm("Xóa toàn bộ dữ liệu đã thu thập?")) { setLogs({ shop: [], rounds: [], games: [] }); flash("Đã xóa dữ liệu"); } }}
          className="px-4 py-3 rounded-xl text-xs font-bold" style={{ background: COL.red + "18", color: COL.red }}>Xóa</button>
      </div>
      {showExport && (
        <textarea readOnly value={JSON.stringify({ logs, statOverrides: ovr }, null, 1)} onFocus={(e) => e.target.select()}
          className="w-full h-48 rounded-xl p-3 text-[10px] mb-6 outline-none" style={{ background: COL.panel, color: COL.mut, border: `1px solid ${COL.line}`, ...NUM }} />
      )}
    </div>
  );

  /* ---- SHEET SỬA CHỈ SỐ GỐC (Danh sách) ---- */
  const editSheet = editUnit !== null && (() => {
    const u = UNITS[editUnit];
    const bs = baseStats(ovr, editUnit);
    const setStat = (lv, j, v) => {
      const ns = bs.map((x) => [...x]);
      ns[lv][j] = Math.max(0, v);
      setOvr({ ...ovr, stats: { ...ovr.stats, [editUnit]: ns } });
    };
    return (
      <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(8,10,16,0.8)" }} onClick={() => setEditUnit(null)}>
        <div className="w-full rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ background: COL.panel, borderTop: `2px solid ${TRIBE_META[u.t].c}` }}>
          <div className="text-base font-extrabold mb-1" style={{ color: COL.ink }}>{u.n}</div>
          <div className="text-[11px] mb-3" style={{ color: COL.mut }}>Sửa chỉ số gốc — áp dụng cho mọi nơi hiển thị (sân, túi, shop, tối ưu).</div>
          {[0, 1, 2].map((lv) => (
            <div key={lv} className="rounded-xl p-3 mb-2 flex items-center justify-between" style={{ background: COL.panel2 }}>
              <span className="text-[10px] font-extrabold w-8" style={{ ...DISP, color: COL.gold }}>lv{lv + 1}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px]" style={{ color: COL.red }}>ATK</span>
                <input type="number" inputMode="numeric" value={bs[lv][0]} onChange={(e) => setStat(lv, 0, parseInt(e.target.value || "0", 10))}
                  className="w-14 text-center rounded-lg py-1.5 text-sm font-extrabold outline-none" style={{ ...NUM, background: COL.panel, color: COL.red, border: `1px solid ${COL.line}` }} />
                <span className="text-[9px] ml-1" style={{ color: COL.green }}>MÁU</span>
                <input type="number" inputMode="numeric" value={bs[lv][1]} onChange={(e) => setStat(lv, 1, parseInt(e.target.value || "0", 10))}
                  className="w-14 text-center rounded-lg py-1.5 text-sm font-extrabold outline-none" style={{ ...NUM, background: COL.panel, color: COL.green, border: `1px solid ${COL.line}` }} />
              </div>
            </div>
          ))}
          <div className="text-xs leading-relaxed mb-3 rounded-xl p-3" style={{ background: COL.panel2, color: COL.ink }}>
            {u.k.map((k, i) => <div key={i} className="mb-1"><b style={{ color: COL.gold }}>lv{i + 1}:</b> {k}</div>)}
          </div>
          <div className="flex gap-2">
            {ovr.stats[editUnit] && (
              <button onClick={() => { const ns = { ...ovr.stats }; delete ns[editUnit]; setOvr({ ...ovr, stats: ns }); }}
                className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: COL.red + "22", color: COL.red }}>Về chỉ số gốc file</button>
            )}
            <button onClick={() => setEditUnit(null)} className="flex-1 py-3 rounded-xl text-sm font-bold" style={{ background: COL.panel2, color: COL.ink }}>Xong</button>
          </div>
        </div>
      </div>
    );
  })();

  /* ---- render ---- */
  const TABS = [["tran", "Trận"], ["doihinh", "Đội hình"], ["toiuu", "Tối ưu"], ["danhsach", "Danh sách"], ["dulieu", "Dữ liệu"]];
  const sheetCtx = sheet ? { ...sheet, cell: sheet.where === "board" ? g.board[sheet.index] : g.hand[sheet.index] } : null;

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: COL.bg, color: COL.ink, maxWidth: "100vw", fontFamily: "-apple-system, 'Segoe UI', Roboto, sans-serif" }}>
      <style>{`
        * { scrollbar-width: thin; scrollbar-color: #2A3042 #0E1016; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0E1016; }
        ::-webkit-scrollbar-thumb { background: #2A3042; border-radius: 8px; border: 2px solid #0E1016; }
        ::-webkit-scrollbar-thumb:hover { background: #3A425A; }
        ::-webkit-scrollbar-corner { background: #0E1016; }
      `}</style>
      <div className="max-w-md mx-auto pb-20">
        {header}
        {tab === "tran" && tabTran}
        {tab === "doihinh" && tabDoihinh}
        {tab === "toiuu" && tabToiuu}
        {tab === "danhsach" && tabDanhsach}
        {tab === "dulieu" && tabDulieu}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: COL.panel, borderTop: `1px solid ${COL.line}` }}>
        <div className="max-w-md mx-auto grid grid-cols-5">
          {TABS.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className="py-3.5 text-[10px] font-extrabold"
              style={{ ...DISP, color: tab === k ? COL.gold : COL.mut, borderTop: tab === k ? `2px solid ${COL.gold}` : "2px solid transparent" }}>{l}</button>
          ))}
        </div>
      </div>

      {picker && (
        <CardPicker game={g} ovr={ovr}
          kinds={picker.mode === "hand" ? ["u", "s", "d"] : picker.mode === "shopSpell" ? ["s"] : ["u"]}
          key={picker.mode + (picker.slot ?? "")}
          restrictTemple={picker.mode === "board" || picker.mode === "shopUnit"}
          onClose={() => setPicker(null)} onPick={handlePick} />
      )}

      {sheetCtx && sheetCtx.cell && (
        <UnitSheet ctx={sheetCtx} ovr={ovr}
          onUpdate={(cell) => {
            if (sheetCtx.where === "board") { const b = [...g.board]; b[sheetCtx.index] = cell; setGame({ ...g, board: b }); }
            else { const h = [...g.hand]; h[sheetCtx.index] = cell; setGame({ ...g, hand: h }); }
          }}
          onAction={(act) => {
            if (act === "deploy") {
              if (sheetCtx.cell.lock) { flash(`Đơn vị đang bị 🔒 khóa ${sheetCtx.cell.lock} lượt nữa (Nergal)`); return; }
              const slot = g.board.findIndex((x) => !x);
              if (slot < 0) { flash("Sân đã đủ 6 quân"); return; }
              const b = [...g.board]; b[slot] = { ...g.hand[sheetCtx.index] };
              delete b[slot].k;
              setGame({ ...g, board: b, hand: g.hand.filter((_, j) => j !== sheetCtx.index) });
              setSheet(null); flash("Đã triển khai (lưu ý: quân đã triển khai không thu về tay được)");
            } else if (act === "sell") {
              if (sheetCtx.where === "hand" && sheetCtx.cell.lock) { flash(`Đơn vị đang bị 🔒 khóa ${sheetCtx.cell.lock} lượt nữa — không bán được`); return; }
              if (sheetCtx.where === "board") { const b = [...g.board]; b[sheetCtx.index] = null; setGame({ ...g, board: b, gold: g.gold + 1 }); }
              else setGame({ ...g, hand: g.hand.filter((_, j) => j !== sheetCtx.index), gold: g.gold + 1 });
              setSheet(null); flash("Đã bán (+1 vàng)");
            } else if (act === "remove") {
              if (sheetCtx.where === "board") { const b = [...g.board]; b[sheetCtx.index] = null; setGame({ ...g, board: b }); }
              else setGame({ ...g, hand: g.hand.filter((_, j) => j !== sheetCtx.index) });
              setSheet(null);
            } else if (act === "move") { setMoveFrom(sheetCtx.index); setSheet(null); }
            else if (act === "absorb") {
              setPendingUse({ eff: { type: "absorb" }, name: UNITS[sheetCtx.cell.id].n, abs: { where: sheetCtx.where, index: sheetCtx.index } });
              setSheet(null);
            }
          }}
          onClose={() => setSheet(null)} />
      )}

      {pendingUse && <TargetPicker g={g} ovr={ovr} pending={pendingUse} onPick={applyPending} onClose={() => setPendingUse(null)} />}

      {nergal && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: "rgba(8,10,16,0.85)" }} onClick={() => setNergal(false)}>
          <div className="w-full rounded-t-3xl p-5 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ background: COL.panel, borderTop: `2px solid ${COL.blue}` }}>
            <div className="text-sm font-extrabold mb-1" style={{ color: COL.ink }}>Xiềng xích địa ngục — chọn quân trong đền</div>
            <div className="text-[11px] mb-3" style={{ color: COL.mut }}>Quân được chọn vào Túi với +2/+2 (không tốn tiền mua) nhưng 🔒 khóa 2 lượt.</div>
            {shopUnits.map((s, i) => {
              if (!s) return null;
              const u = UNITS[s.id];
              return (
                <button key={i} onClick={() => {
                  const su = [...shopUnits]; su[i] = null;
                  setGame({
                    ...g, gold: g.gold - 1, shop: { ...g.shop, units: su },
                    hand: [...applyHandGrow(g.hand), { k: "u", id: s.id, lv: 0, dA: 2 + g.shopBuff.a + (u.t === "NILES" ? g.guard.nilesBuff : 0), dH: 2 + g.shopBuff.h, lock: 2 }],
                    guard: { ...g.guard, cd: true },
                  });
                  setNergal(false);
                  flash(`NERGAL khóa "${u.n}" +2/+2 vào Túi (🔒 2 lượt)`);
                }} className="w-full text-left rounded-xl p-2.5 mb-1.5 flex items-center gap-2.5"
                  style={{ background: COL.panel2, border: `1px solid ${COL.line}`, borderLeft: `3px solid ${TRIBE_META[u.t].c}` }}>
                  <span className="text-xs font-bold flex-1" style={{ color: COL.ink }}>{u.n}</span>
                  <span className="text-[10px] font-extrabold" style={{ ...NUM, color: TRIBE_META[u.t].c }}>C{u.c} · {baseStats(ovr, s.id)[0][0] + g.shopBuff.a}/{baseStats(ovr, s.id)[0][1] + g.shopBuff.h}</span>
                </button>
              );
            })}
            {!shopUnits.some(Boolean) && <div className="text-xs mb-2" style={{ color: COL.mut }}>Chưa nhập quân nào vào Thánh Đền.</div>}
            <button onClick={() => setNergal(false)} className="w-full py-3 rounded-xl text-sm font-bold" style={{ background: COL.panel2, color: COL.ink }}>Hủy</button>
          </div>
        </div>
      )}

      {editSheet}

      {toast && (
        <div className="fixed bottom-20 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: COL.panel2, color: COL.ink, border: `1px solid ${COL.gold}55` }}>{toast}</div>
        </div>
      )}
    </div>
  );
}